export interface ResultSet<RowType = unknown> {
  more: boolean;
  checkpoint: { type: "cursor" | "skip"; value: string | number };
  rows: RowType[];
  limit?: number;
  total?: number;
}

export class TraversableResultSet<RowType = unknown>
  implements ResultSet<RowType> {
  more = false;
  checkpoint: { type: "cursor" | "skip"; value: string | number } = {
    type: "skip",
    value: 0
  };
  limit?: number;
  rows: RowType[] = [];
  total?: number;
  loadingMore = false;

  constructor(
    data: ResultSet<RowType>,
    public fetcher: (set: ResultSet<RowType>) => Promise<ResultSet<RowType>>
  ) {
    this.setData(data);
  }

  setData(data: ResultSet<RowType>) {
    this.more = data.more;
    this.checkpoint = data.checkpoint;
    this.limit = data.limit;
    this.rows = data.rows;
    this.total = data.total;
  }

  addData(data: ResultSet<RowType>) {
    this.setData({
      ...data,
      rows: this.rows.concat(data.rows)
    });
  }

  async fetchMore(expand = true) {
    this.loadingMore = true;
    const data = await this.fetcher(this);
    if (expand) {
      this.addData(data);
    }
    this.loadingMore = false;
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
