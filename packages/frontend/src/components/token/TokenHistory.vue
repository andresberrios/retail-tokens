<template>
  <div>
    <div v-if="loading" class="text-center text-dark">
      <b-spinner variant="dark" class="align-middle"></b-spinner>
      <strong>Loading...</strong>
    </div>
    <div v-else-if="items.length === 0">
      <p>
        Could not find transactions for this token.
      </p>
    </div>
    <TransfersTable
      v-else
      :transfers="items"
      :has-more="hasMore"
      :loading-more="loadingMore"
      @load-more="loadMore"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Avatar from "../Avatar.vue";
import TransfersTable, { Transfer } from "../TransfersTable.vue";
import { DateTime } from "luxon";

const limit = 10;

@Component({
  components: { Avatar, TransfersTable }
})
export default class TokenHistory extends Vue {
  @Prop({ required: true })
  token!: string;

  items: Transfer[] = [];
  skip = 0;
  total = 0;

  loading = true;
  loadingMore = false;

  get hasMore() {
    return this.items.length < this.total;
  }

  @Watch("token", { immediate: true })
  async initialLoad() {
    this.loading = true;
    this.items = [];
    this.skip = 0;
    if (this.token) {
      await this.loadMore();
    }
    this.loading = false;
  }

  async loadMore() {
    this.loadingMore = true;
    const { actions, total } = await this.$client.getTokenTransfers(
      this.token,
      this.skip,
      limit
    );
    this.total = total;
    this.skip += limit;
    const newItems = actions.map(a => ({
      id: a.trx_id.slice(0, 8),
      date: DateTime.fromISO(a["@timestamp"].toString()).toFormat("FF"),
      from: a.act.data.from,
      to: a.act.data.to,
      amount: a.act.data.quantity,
      memo: a.act.data.memo
    }));
    this.items = this.items.concat(newItems);
    this.loadingMore = false;
  }
}
</script>
