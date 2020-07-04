<template>
  <div>
    <div class="my-3">
      <TransfersTable :transfers="items" :loading="loading" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Avatar from "./Avatar.vue";
import TransfersTable, { Transfer } from "./TransfersTable.vue";

@Component({
  components: { Avatar, TransfersTable }
})
export default class TransactionHistory extends Vue {
  @Prop({ required: true })
  account!: string;

  items: Transfer[] | null = null;

  loading = true;

  @Watch("account", { immediate: true })
  async loadHistory() {
    this.loading = true;
    const actions = await this.$client.getAccountTransfers(this.account);
    this.items = actions.map(a => ({
      id: a.trx_id.slice(0, 8),
      date: a["@timestamp"].toString(),
      from: a.act.data.from,
      to: a.act.data.to,
      amount: a.act.data.quantity,
      memo: a.act.data.memo
    }));
    this.loading = false;
  }
}
</script>

<style></style>
