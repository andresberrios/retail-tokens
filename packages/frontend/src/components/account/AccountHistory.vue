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
      <b-form inline class="my-4">
        <label for="filter-token">Filter by Token:</label>
        <b-form-select
          v-model="selectedToken"
          :options="options"
          id="filter-token"
          class="ml-3"
          inline
        >
          <template v-slot:first>
            <b-form-select-option :value="null">
              -- All tokens --
            </b-form-select-option>
          </template>
        </b-form-select>
        <span v-if="selectedToken" class="ml-2">
          Showing {{ filteredTokens.length }} of {{ items.length }} loaded
          transactions
        </span>
      </b-form>
      <TransfersTable
        :transfers="filteredTokens"
        :has-more="result.more"
        :loading-more="result.loadingMore"
        @load-more="loadMore"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Avatar from "../Avatar.vue";
import TransfersTable from "../TransfersTable.vue";
import { formatDate } from "../../services/dateFormatter";
import { TraversableResultSet } from "../../services/resultSet";
import { Action } from "@eoscafe/hyperion";
import { TransferData } from "../../services/client";

@Component({
  components: { Avatar, TransfersTable }
})
export default class AccountHistory extends Vue {
  @Prop({ required: true })
  account!: string;

  selectedToken: string | null = null;
  options: { value: string; text: string }[] | null = null;
  loading = true;

  result: TraversableResultSet<Action<TransferData>> | null = null;

  get filteredTokens() {
    this.items;
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

  get items() {
    return !this.result
      ? []
      : this.result.rows.map(a => ({
          id: a.trx_id.slice(0, 8),
          date: formatDate(a["@timestamp"].toString()),
          from: a.act.data.from,
          to: a.act.data.to,
          amount: a.act.data.quantity,
          memo: a.act.data.memo
        }));
  }

  async initialLoad() {
    this.result = await this.$client.getAccountTransfers(this.account);
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
    await Promise.all([this.initialLoad(), this.loadTokenBalance()]);
    this.loading = false;
  }

  async loadMore() {
    await this.result?.fetchMore();
  }
}
</script>

<style></style>
