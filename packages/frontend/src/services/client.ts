/* eslint-disable @typescript-eslint/camelcase */

import { JsonRpc as Hyperion } from "@eoscafe/hyperion";
import { JsonRpc } from "eosjs";
import { SerialBuffer } from "eosjs/dist/eosjs-serialize";
import { LinkSession } from "anchor-link";

export interface ResultSet<RowType> {
  more: boolean;
  next_key: string;
  rows: RowType[];
}

export class TraversableResultSet<RowType> implements ResultSet<RowType> {
  more = false;
  next_key = "";
  rows: RowType[] = [];

  constructor(
    data: ResultSet<RowType>,
    public fetcher: (set: ResultSet<RowType>) => Promise<ResultSet<RowType>>
  ) {
    this.setData(data);
  }

  setData(data: ResultSet<RowType>) {
    this.more = data.more;
    this.next_key = data.next_key;
    this.rows = data.rows;
  }

  addData(data: ResultSet<RowType>) {
    this.setData({
      ...data,
      rows: [...this.rows, ...data.rows]
    });
  }

  async fetchMore(expand = true) {
    const data = await this.fetcher(this);
    if (expand) {
      this.addData(data);
    }
    return data;
  }

  async fetchRest(expand = true) {
    const data = expand ? this : new TraversableResultSet(this, this.fetcher);
    while (data.more) {
      await data.fetchMore();
    }
    return data;
  }
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

export default class BlockchainClient {
  hyp: Hyperion;
  rpc: JsonRpc;
  session?: LinkSession;

  constructor(
    endpoint = process.env.VUE_APP_CHAIN_NODE || "http://localhost:8080",
    public contract = process.env.VUE_APP_CONTRACT_ACCOUNT || "retailtokens"
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

  validatePreviousResultSet(set?: ResultSet<unknown>) {
    if (set && !set.more) {
      throw new TypeError(
        "Previous result set indicates there are no more results after itself"
      );
    }
  }

  async getAccountTransfers(
    account: string,
    skip = 0,
    limit = 100,
    sort: "desc" | "asc" = "desc"
  ) {
    const data = await this.hyp.get_actions<TransferData>(account, {
      "act.account": this.contract,
      "act.name": "transfer",
      skip,
      limit,
      sort
    });
    return data.actions;
  }

  async getTokenTransfers(
    symbol: string,
    skip = 0,
    limit = 100,
    sort: "desc" | "asc" = "desc"
  ) {
    const data = await this.hyp.get_actions<TransferData>(this.contract, {
      "act.account": this.contract,
      "act.name": "transfer",
      "transfer.symbol": symbol,
      skip,
      limit,
      sort
    });
    return data.actions;
  }

  async getTokens(
    account: string,
    previousSet?: ResultSet<string>
  ): Promise<TraversableResultSet<string>> {
    this.validatePreviousResultSet(previousSet);
    const data: ResultSet<{
      balance: string;
    }> = await this.rpc.get_table_rows({
      json: true,
      code: this.contract,
      scope: account,
      table: "accounts",
      lower_bound: previousSet && previousSet.next_key
    });
    return new TraversableResultSet(
      { ...data, rows: data.rows.map(r => r.balance) },
      set => this.getTokens(account, set)
    );
  }

  async getAllTokens(
    previousSet?: ResultSet<string>
  ): Promise<TraversableResultSet<string>> {
    this.validatePreviousResultSet(previousSet);
    const data: {
      more: string;
      rows: Array<{ scope: string }>;
    } = await this.rpc.get_table_by_scope({
      code: "retailtokens",
      table: "stat",
      lower_bound: previousSet?.next_key
    });

    const tokens = data.rows.map(({ scope }) => {
      const buffer = new SerialBuffer();
      buffer.pushName(scope);
      return buffer.getSymbolCode();
    });

    return new TraversableResultSet(
      {
        more: !!data.more,
        next_key: data.more,
        rows: tokens
      },
      set => this.getAllTokens(set)
    );
  }

  async getAllTokenStats(
    previousSet?: ResultSet<TokenStats>
  ): Promise<TraversableResultSet<TokenStats>> {
    this.validatePreviousResultSet(previousSet);
    const data = await this.getAllTokens(
      previousSet ? { ...previousSet, rows: [] } : undefined
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
    this.validatePreviousResultSet(previousSet);
    const data: {
      more: string;
      rows: Array<{ scope: string }>;
    } = await this.rpc.get_table_by_scope({
      code: this.contract,
      table: "accounts",
      lower_bound: previousSet && previousSet.next_key
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
        next_key: data.more,
        rows: accounts
      },
      set => this.getAllTokenHolders(set)
    );
  }

  async getTokenHolders(
    symbol: string,
    previousSet?: ResultSet<TokenHolder>
  ): Promise<TraversableResultSet<TokenHolder>> {
    this.validatePreviousResultSet(previousSet);
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
}
