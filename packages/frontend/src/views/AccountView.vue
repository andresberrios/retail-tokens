<template>
  <div>
    <div v-if="loading" class="d-flex justify-content-center m-5">
      <b-spinner large variant="dark" label="Loading..."></b-spinner>
      <strong class="color: grey; mx-2">Loading...</strong>
    </div>
    <div v-else-if="accountNotFound"></div>
    <div v-else>
      <b-container class="my-5">
        <div>
          <Avatar size="4em" :value="account" type="account" />
          <span class="mx-2">{{ account }}</span>
        </div>
        <div class="tabs my-5">
          <b-card no-body>
            <b-tabs card>
              <b-tab title="Account">
                <TokenBalances :account="account" />
                <hr class="my-2" />
                <TransactionHistory :account="account" />
              </b-tab>
              <b-tab title="COOL Token">
                <TokenInfo token="COOL" />
              </b-tab>
            </b-tabs>
          </b-card>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TokenBalances from "../components/TokenBalances.vue";
import TransactionHistory from "../components/TransactionHistory.vue";
import Avatar from "../components/Avatar.vue";
import TokenInfo from "../components/TokenInfo.vue";

@Component({
  components: {
    TokenBalances,
    TransactionHistory,
    Avatar,
    TokenInfo
  }
})
export default class AccountView extends Vue {
  @Prop({ required: true })
  account!: string;

  accountNotFound = false;
  loading = true;

  async mounted() {
    // Check if account exists
    await new Promise(r => setTimeout(r, 1000));
    this.loading = false;
  }
}
</script>

<style></style>
