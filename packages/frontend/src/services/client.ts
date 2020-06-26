import { JsonRpc as Hyperion } from "@eoscafe/hyperion";
import { JsonRpc } from "eosjs";

export default class BlockchainClient {
  rpc: Hyperion;
  eosRpc: JsonRpc;

  constructor(
    endpoint = "http://localhost:8888/",
    public contract = "retailtokens"
  ) {
    this.rpc = new Hyperion(endpoint, { fetch });
    this.eosRpc = new JsonRpc(endpoint);
  }

  async getActions(
    account: string,
    skip = 0,
    limit = 100,
    sort: "desc" | "asc" = "desc"
  ) {
    return this.rpc.get_actions(account, {
      skip,
      limit,
      sort
    });
  }

  async getTokens(account: string) {
    return this.eosRpc.get_table_rows({
      json: true,
      code: this.contract,
      scope: account,
      table: "accounts"
    });
  }

  async getAllTokens() {
    const { actions } = await this.rpc.get_actions(this.contract, {
      "act.name": "create"
    });
    return actions.map(a => (a.act.data as any).maximum_supply.split(" ")[1]);

    // Alternate implementation, requires converting eosio names into symbol_codes:
    // const data = await this.eosRpc.get_table_by_scope({
    //   code: "retailtokens",
    //   table: "stat"
    // });
  }
}
