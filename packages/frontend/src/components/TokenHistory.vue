<template>
  <div class="my-5">
    <div v-if="!loading && !items">
      There are no tokens issued by this account.
    </div>
    <TransfersTable v-else :transfers="items" :loading="loading" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Avatar from "./Avatar.vue";
import { TokenStats } from "../services/client";
import TransfersTable, { Transfer } from "./TransfersTable.vue";

@Component({
  components: { Avatar, TransfersTable }
})
export default class TokenHistory extends Vue {
  @Prop({ required: true })
  account!: string;

  items: Transfer[] | null = null;

  loading = true;

  get accountAndAllTokens() {
    return { account: this.account, allTokens: this.$store.state.allTokens };
  }

  @Watch("accountAndAllTokens", { immediate: true, deep: true })
  async loadHistory() {
    const token: TokenStats | undefined = this.$store.getters.getIssuedToken(
      this.account
    );
    if (token) {
      const actions = await this.$client.getTokenTransfers(token.symbol);
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

<style></style>
