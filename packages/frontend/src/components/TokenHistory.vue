<template>
  <div>
    <div v-if="loading" class="text-center text-dark">
      <b-spinner variant="dark" class="align-middle"></b-spinner>
      <strong>Loading...</strong>
    </div>
    <div v-else-if="items && items.length === 0">
      <p>
        Could not find transactions for this token.
      </p>
    </div>
    <TransfersTable v-else :transfers="items" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Avatar from "./Avatar.vue";
import TransfersTable, { Transfer } from "./TransfersTable.vue";

@Component({
  components: { Avatar, TransfersTable }
})
export default class TokenHistory extends Vue {
  @Prop({ required: true })
  token!: string;

  items: Transfer[] | null = null;

  loading = true;

  @Watch("token", { immediate: true })
  async loadHistory() {
    if (this.token) {
      this.loading = true;
      const actions = await this.$client.getTokenTransfers(this.token);
      this.items = actions.map(a => ({
        id: a.trx_id.slice(0, 8),
        date: a["@timestamp"].toString(),
        from: a.act.data.from,
        to: a.act.data.to,
        amount: a.act.data.quantity,
        memo: a.act.data.memo
      }));
    }
    this.loading = false;
  }
}
</script>
