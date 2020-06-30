<template>
  <div>
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else-if="accountNotFound"></div>
    <div v-else>
      <b-container class="my-5">
        <Avatar size="4em" :value="account" />
        <span class="mr-auto">{{ account }}</span>
      </b-container>
      <TokenBalances :account="account" />
      <UserList />
      <TransactionHistory :account="account" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TokenBalances from "../components/TokenBalances.vue";
import TransactionHistory from "../components/TransactionHistory.vue";
import UserList from "../components/UserList.vue";
import Avatar from "../components/Avatar.vue";

@Component({
  components: { TokenBalances, TransactionHistory, UserList, Avatar }
})
export default class AccountView extends Vue {
  @Prop({ required: true })
  account!: string;

  accountNotFound = false;
  loading = true;

  async mounted() {
    // Check if account exists
    await new Promise(r => setTimeout(r, 3000));
    this.loading = false;
  }
}
</script>

<style></style>
