<template>
  <div>
    <div v-if="loading" class="text-center text-dark">
      <b-spinner variant="dark" class="align-middle"></b-spinner>
      <strong>Loading...</strong>
    </div>
    <div v-else-if="items && items.length === 0">
      <p>This account has no transactions</p>
    </div>
    <div v-else>
      <label for="filter-token">Filter by Token</label>
      <b-form-select
        v-model="selectedToken"
        :options="options"
        id="filter-token"
        class="my-3"
      >
        <template v-slot:first>
          <b-form-select-option :value="null">
            -- All tokens --
          </b-form-select-option>
        </template>
      </b-form-select>
      <TransfersTable :transfers="filteredTokens" />
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
  selectedToken: string | null = null;
  options: { value: string; text: string }[] | null = null;
  loading = true;

  get filteredTokens() {
    if (this.items === null) {
      return this.items;
    }
    if (this.items === [] || !this.selectedToken) {
      return this.items;
    }
    return this.items.filter(
      item => item.amount.split(" ")[1] === this.selectedToken
    );
  }

  async loadHistory() {
    const actions = await this.$client.getAccountTransfers(this.account);
    this.items = actions.map(a => ({
      id: a.trx_id.slice(0, 8),
      date: a["@timestamp"].toString(),
      from: a.act.data.from,
      to: a.act.data.to,
      amount: a.act.data.quantity,
      memo: a.act.data.memo
    }));
  }

  async loadTokenBalance() {
    const data = await this.$client.getTokens(this.account);
    await data.fetchRest();
    this.options = data.rows.map(b => ({
      value: b.split(" ")[1],
      text: b.split(" ")[1]
    }));
  }

  @Watch("account", { immediate: true })
  async loadTransactions() {
    this.loading = true;
    await Promise.all([this.loadHistory(), this.loadTokenBalance()]);
    this.loading = false;
  }
}
</script>

<style></style>
