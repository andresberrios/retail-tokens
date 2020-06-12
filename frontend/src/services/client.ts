export class BlockchainClient {
  constructor(public fetch: typeof window.fetch) {}

  async getActions(
    account: string,
    skip = 0,
    limit = 100,
    sort: "desc" | "asc" = "desc"
  ) {
    return this.fetch(
      `https://telos.caleos.io/v2/history/get_actions?account=${account}&skip=${skip}&limit=${limit}&sort=${sort}`
    );
  }
}
