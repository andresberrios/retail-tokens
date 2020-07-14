<template>
  <b-container class="py-5">
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center"
    >
      <b-spinner large variant="dark" label="Loading..."></b-spinner>
      <strong class="mx-2 color-dark">Loading...</strong>
    </div>
    <b-alert show variant="danger" v-else-if="!accountFound">
      <h2>Account Not Found</h2>
    </b-alert>
    <div v-else>
      <div class="d-flex align-items-center">
        <Avatar size="4em" :value="account" type="account" />
        <h2 class="m-0 ml-3">
          {{ account }}
        </h2>
      </div>
      <b-card no-body class="my-5">
        <b-tabs card>
          <b-tab title="Account">
            <h4>Token Balance</h4>
            <TokenBalances :account="account" />
            <h4 class="mt-5 mb-3">Transactions</h4>
            <AccountHistory :account="account" />
          </b-tab>
          <b-tab
            v-for="token in tokens"
            :key="token.symbol"
            :title="token.symbol"
            lazy
            ><TokenInfo :token="token.symbol" />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import TokenBalances from "../components/account/TokenBalances.vue";
import AccountHistory from "../components/account/AccountHistory.vue";
import Avatar from "../components/Avatar.vue";
import TokenInfo from "../components/token/TokenInfo.vue";
import { TokenStats } from "../services/client";

@Component({
  components: {
    TokenBalances,
    AccountHistory,
    Avatar,
    TokenInfo
  }
})
export default class AccountView extends Vue {
  @Prop({ required: true })
  account!: string;

  accountFound = false;
  loading = true;

  get tokens(): TokenStats[] {
    return this.$store.getters.getIssuedTokens(this.account);
  }

  @Watch("account", { immediate: true })
  async isAccount() {
    this.loading = true;
    this.accountFound = await this.$client.accountExists(this.account);
    this.loading = false;
  }
}
</script>
