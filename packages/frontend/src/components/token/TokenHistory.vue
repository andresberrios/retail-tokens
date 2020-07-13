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
      :has-more="result.more"
      :loading-more="result.loadingMore"
      @load-more="loadMore"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Avatar from "../Avatar.vue";
import TransfersTable, { Transfer } from "../TransfersTable.vue";
import { DateTime } from "luxon";
import { TraversableResultSet } from "../../services/resultSet";
import { Action } from "@eoscafe/hyperion";
import { TransferData } from "../../services/client";

@Component({
  components: { Avatar, TransfersTable }
})
export default class TokenHistory extends Vue {
  @Prop({ required: true })
  token!: string;

  result: TraversableResultSet<Action<TransferData>> | null = null;

  loading = true;

  @Watch("token", { immediate: true })
  async initialLoad() {
    this.loading = true;
    if (this.token) {
      this.result = await this.$client.getTokenTransfers(this.token);
    }
    this.loading = false;
  }

  get items(): Transfer[] {
    return !this.result
      ? []
      : this.result.rows.map(a => ({
          id: a.trx_id.slice(0, 8),
          date: DateTime.fromISO(a["@timestamp"].toString()).toFormat("FF"),
          from: a.act.data.from,
          to: a.act.data.to,
          amount: a.act.data.quantity,
          memo: a.act.data.memo
        }));
  }

  async loadMore() {
    await this.result?.fetchMore();
  }
}
</script>
