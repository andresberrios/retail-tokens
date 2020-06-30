<template>
  <div>
    <div class="my-5">
      <div class="my-2 mx-1">Transactions</div>
      <b-table
        hover
        :items="items"
        :fields="fields"
        :bordered="true"
        :busy="loading"
        head-variant="dark"
        table-variant="dark"
        stacked="sm"
      >
        <template v-slot:table-busy>
          <div class="text-center text-light my-2">
            <b-spinner variant="light" class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
        <template v-slot:cell(from)="data">
          <router-link
            :to="{ name: 'account', params: { account: data.value } }"
          >
            <Avatar size="2em" :value="data.value" type="account" />
            {{ data.value }}
          </router-link>
        </template>
        <template v-slot:cell(to)="data">
          <router-link
            :to="{ name: 'account', params: { account: data.value } }"
          >
            <Avatar size="2em" :value="data.value" type="account" />
            {{ data.value }}
          </router-link>
        </template>
        <template v-slot:cell(amount)="data">
          {{ data.value }}
          <Avatar size="2em" :value="data.value" type="token" />
        </template>
      </b-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Avatar from "../components/Avatar.vue";

@Component({
  components: { Avatar }
})
export default class TransactionHistory extends Vue {
  @Prop({ required: true })
  account!: string;

  fields = [{ label: "ID", key: "id" }, "date", "from", "to", "amount", "memo"];
  items: Array<{
    id: string;
    date: string;
    from: string;
    to: string;
    amount: string;
    memo: string;
  }> | null = null;

  loading = true;

  @Watch("account", { immediate: true })
  async loadHistory() {
    const actions = await this.$client.getTransfers(this.account);
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
