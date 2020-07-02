<template>
  <div class="my-5">
    <div v-if="!loading && !items">
      There are no tokens issued by this account.
    </div>
    <b-table
      v-else
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
        <router-link :to="{ name: 'account', params: { account: data.value } }">
          <Avatar size="2em" :value="data.value" type="account" />
          {{ data.value }}
        </router-link>
      </template>
      <template v-slot:cell(to)="data">
        <router-link :to="{ name: 'account', params: { account: data.value } }">
          <Avatar size="2em" :value="data.value" type="account" />
          {{ data.value }}
        </router-link>
      </template>
      <template v-slot:cell(amount)="data">
        {{ data.value }}
        <Avatar size="1.5em" :value="data.value.split(' ')[1]" type="token" />
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Avatar from "../components/Avatar.vue";
import { TokenStats } from "../services/client";

@Component({
  components: { Avatar }
})
export default class TokenHistory extends Vue {
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
