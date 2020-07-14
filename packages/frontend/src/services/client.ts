/* eslint-disable @typescript-eslint/camelcase */

import { JsonRpc as Hyperion, Action } from "@eoscafe/hyperion";
import { JsonRpc } from "eosjs";
import { SerialBuffer } from "eosjs/dist/eosjs-serialize";
import { LinkSession } from "anchor-link";
import { ResultSet, TraversableResultSet } from "./resultSet";

interface TableRowsResultSet<RowType = unknown> {
  more: boolean;
  next_key: string;
  rows: RowType[];
}

interface TableScopesResultSet {
  more: string;
  rows: Array<{ scope: string }>;
}

interface BackendResultSet<RowType> {
  more: boolean;
  cursor: string;
  rows: RowType[];
  total: number;
}

export interface HolderBalances {
  account: string;
  balances: string[];
}

export interface TokenHolder {
  account: string;
  balance: string;
}

export interface TransferData {
  amount: number;
  symbol: string;
  from: string;
  to: string;
  quantity: string;
  memo: string;
}

export interface TokenStats {
  symbol: string;
  supply: string;
  max_supply: string;
  issuer: string;
}

interface AccountPermission {
  perm_name: string;
  parent: string;
  required_auth: {
    threshold: number;
    keys: [
      {
        key: string;
        weight: number;
      }
    ];
    accounts: unknown[];
    waits: unknown[];
  };
}

interface AccountInfo {
  account_name: string;
  created: string;
  permissions: AccountPermission[];
}

export interface Registration {
  _id: string;
  token: string;
  account: string;
  email: string;
  rewardedAt: string | null;
}

async function jsonFetch(url: string, body: unknown, method = "POST") {
  return fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

function validatePreviousResultSet(set?: ResultSet) {
  if (set && !set.more) {
    throw new TypeError(
      "Previous result set indicates there are no more results after itself"
    );
  }
}

function getCursorCheckpoint(set?: ResultSet) {
  if (!set) {
    return undefined;
  }
  if (set.checkpoint.type !== "cursor") {
    throw new TypeError("Checkpoint type mismatch");
  }
  return set.checkpoint.value;
}

function getNextSkipCheckpoint(set?: ResultSet, limit = set?.limit || 20) {
  if (!set) {
    return 0;
  }
  if (set.checkpoint.type !== "skip") {
    throw new TypeError("Checkpoint type mismatch");
  }
  return (set.checkpoint.value as number) + limit;
}

export default class BlockchainClient {
  hyp: Hyperion;
  rpc: JsonRpc;
  session?: LinkSession;

  constructor(
    endpoint = "http://localhost:8080",
    public contract = "retailtokens",
    public backend = "http://localhost:3000"
  ) {
    this.hyp = new Hyperion(endpoint, { fetch });
    this.rpc = new JsonRpc(this.hyp.endpoint);
  }

  async getAccountInfo(account: string): Promise<AccountInfo | undefined> {
    try {
      return await this.rpc.get_account(account);
    } catch (error) {
      return undefined;
    }
  }

  async accountExists(account: string): Promise<boolean> {
    return (await this.getAccountInfo(account)) !== undefined;
  }

  async getAccountTransfers(
    account: string,
    previousSet?: ResultSet<Action<TransferData>>
  ): Promise<TraversableResultSet<Action<TransferData>>> {
    const limit = previousSet?.limit || 30;
    const skip = getNextSkipCheckpoint(previousSet, limit);
    const data = await this.hyp.get_actions<TransferData>(account, {
      "act.account": this.contract,
      "act.name": "transfer",
      sort: "desc",
      skip,
      limit
    });
    return new TraversableResultSet(
      {
        more: skip + limit < data.total.value,
        checkpoint: { type: "skip", value: skip },
        limit,
        rows: data.actions,
        total: data.total.value
      },
      set => this.getAccountTransfers(account, set)
    );
  }

  async getTokenTransfers(
    symbol: string,
    previousSet?: ResultSet<Action<TransferData>>
  ): Promise<TraversableResultSet<Action<TransferData>>> {
    validatePreviousResultSet(previousSet);
    const limit = previousSet?.limit || 30;
    const skip = getNextSkipCheckpoint(previousSet, limit);
    const data = await this.hyp.get_actions<TransferData>(this.contract, {
      "act.account": this.contract,
      "act.name": "transfer",
      "transfer.symbol": symbol,
      sort: "desc",
      limit,
      skip
    });
    return new TraversableResultSet(
      {
        more: skip + limit < data.total.value,
        checkpoint: { type: "skip", value: skip },
        limit,
        rows: data.actions,
        total: data.total.value
      },
      set => this.getTokenTransfers(symbol, set)
    );
  }

  async getTokens(
    account: string,
    previousSet?: ResultSet<string>
  ): Promise<TraversableResultSet<string>> {
    validatePreviousResultSet(previousSet);
    const limit = previousSet?.limit || 100;
    const data: TableRowsResultSet<{
      balance: string;
    }> = await this.rpc.get_table_rows({
      json: true,
      code: this.contract,
      scope: account,
      table: "accounts",
      limit,
      lower_bound: getCursorCheckpoint(previousSet)
    });
    return new TraversableResultSet(
      {
        more: data.more,
        checkpoint: { type: "cursor", value: data.next_key },
        limit,
        rows: data.rows.map(r => r.balance)
      },
      set => this.getTokens(account, set)
    );
  }

  async getAllTokens(
    previousSet?: ResultSet<string>
  ): Promise<TraversableResultSet<string>> {
    validatePreviousResultSet(previousSet);
    const limit = previousSet?.limit || 100;
    const data: TableScopesResultSet = await this.rpc.get_table_by_scope({
      code: this.contract,
      table: "stat",
      lower_bound: getCursorCheckpoint(previousSet)
    });

    const tokens = data.rows.map(({ scope }) => {
      const buffer = new SerialBuffer();
      buffer.pushName(scope);
      return buffer.getSymbolCode();
    });

    return new TraversableResultSet(
      {
        more: !!data.more,
        checkpoint: { type: "cursor", value: data.more },
        limit,
        rows: tokens
      },
      set => this.getAllTokens(set)
    );
  }

  async getAllTokenStats(
    previousSet?: ResultSet<TokenStats>
  ): Promise<TraversableResultSet<TokenStats>> {
    const data = await this.getAllTokens(
      previousSet && { ...previousSet, rows: [] }
    );

    const stats: TokenStats[] = await Promise.all(
      data.rows.map(async symbol => {
        const s: {
          [symbol: string]: {
            supply: string;
            max_supply: string;
            issuer: string;
          };
        } = await this.rpc.get_currency_stats(this.contract, symbol);
        const [, details] = Object.entries(s)[0];
        return { ...details, symbol };
      })
    );

    return new TraversableResultSet({ ...data, rows: stats }, set =>
      this.getAllTokenStats(set)
    );
  }

  async getAllTokenHolders(
    previousSet?: ResultSet<HolderBalances>
  ): Promise<TraversableResultSet<HolderBalances>> {
    validatePreviousResultSet(previousSet);
    const limit = previousSet?.limit || 100;
    const data: TableScopesResultSet = await this.rpc.get_table_by_scope({
      code: this.contract,
      table: "accounts",
      limit,
      lower_bound: getCursorCheckpoint(previousSet)
    });

    const accounts: HolderBalances[] = await Promise.all(
      data.rows.map(async r => {
        const tokens = await this.getTokens(r.scope);
        await tokens.fetchRest();
        return {
          account: r.scope,
          balances: tokens.rows
        };
      })
    );

    return new TraversableResultSet(
      {
        more: !!data.more,
        checkpoint: { type: "cursor", value: data.more },
        limit,
        rows: accounts
      },
      set => this.getAllTokenHolders(set)
    );
  }

  async getTokenHolders(
    symbol: string,
    previousSet?: ResultSet<TokenHolder>
  ): Promise<TraversableResultSet<TokenHolder>> {
    validatePreviousResultSet(previousSet);
    const data = await this.getAllTokenHolders(
      previousSet ? { ...previousSet, rows: [] } : undefined
    );

    const filtered = data.rows
      .map(r => ({
        account: r.account,
        balance: r.balances.find(b => b.split(" ")[1] === symbol) as string
      }))
      .filter(r => r.balance);

    return new TraversableResultSet({ ...data, rows: filtered }, set =>
      this.getTokenHolders(symbol, set)
    );
  }

  private requireSession() {
    if (!this.session) {
      throw new TypeError("Session is required");
    }
  }

  private requireIdentityProof() {
    this.requireSession();
    if (!this.session?.metadata.proof) {
      throw new TypeError("Could not find session proof");
    }
  }

  async getPendingRegistrations(
    token: string,
    previousSet?: ResultSet<Registration>
  ): Promise<TraversableResultSet<Registration>> {
    this.requireIdentityProof();
    const limit = previousSet?.limit || 20;
    const res = await jsonFetch(
      `${this.backend}/registrations/pending/${token}`,
      {
        proof: this.session?.metadata.proof,
        limit,
        cursor: getCursorCheckpoint(previousSet)
      }
    );
    if (!res.ok) {
      throw new Error("Could not fetch pending registrations");
    }
    const data: BackendResultSet<Registration> = await res.json();

    return new TraversableResultSet(
      {
        more: data.more,
        checkpoint: { type: "cursor", value: data.cursor },
        limit,
        rows: data.rows,
        total: data.total
      },
      set => this.getPendingRegistrations(token, set)
    );
  }

  async getRewardedRegistrations(
    token: string,
    previousSet?: ResultSet<Registration>
  ): Promise<TraversableResultSet<Registration>> {
    this.requireIdentityProof();
    const limit = previousSet?.limit || 20;
    const res = await jsonFetch(
      `${this.backend}/registrations/rewarded/${token}`,
      {
        proof: this.session?.metadata.proof,
        limit,
        cursor: getCursorCheckpoint(previousSet)
      }
    );
    if (!res.ok) {
      throw new Error("Could not fetch rewarded registrations");
    }
    const data: BackendResultSet<Registration> = await res.json();

    return new TraversableResultSet(
      {
        more: data.more,
        checkpoint: { type: "cursor", value: data.cursor },
        limit,
        rows: data.rows,
        total: data.total
      },
      set => this.getRewardedRegistrations(token, set)
    );
  }

  async submitRegistration(token: string, account: string, email: string) {
    const res = await jsonFetch(`${this.backend}/registrations`, {
      token,
      account,
      email
    });
    if (!res.ok) {
      if (res.status === 400) {
        let data;
        try {
          data = await res.json();
        } catch (error) {
          throw new Error("Invalid request sent when posting registration");
        }
        throw data;
      }
      throw new Error("Could not post registration");
    }
  }

  async giveTokens(
    quantity: string,
    account: string,
    registrationId: string
  ): Promise<Registration> {
    this.requireSession();
    const token = quantity.split(" ")[1];
    await this.session?.transact({
      action: {
        account: this.contract,
        name: "transfer",
        authorization: [this.session.auth],
        data: {
          from: this.session.auth.actor,
          to: account,
          quantity,
          memo: `Welcome to ${token}`
        }
      }
    });
    try {
      const res = await fetch(
        `${this.backend}/registrations/${registrationId}/rewarded`,
        { method: "PUT" }
      );
      if (!res.ok) {
        throw new Error("Failed to mark registration as rewarded!");
      }
      return res.json();
    } catch (error) {
      error.code = "SERVER_ERROR";
      throw error;
    }
  }
}
