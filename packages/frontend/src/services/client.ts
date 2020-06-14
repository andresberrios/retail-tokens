import { JsonRpc } from "@eoscafe/hyperion";

export default class BlockchainClient {
  rpc: JsonRpc;

  constructor(endpoint = "http://localhost:8888/") {
    this.rpc = new JsonRpc(endpoint, { fetch });
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
}
