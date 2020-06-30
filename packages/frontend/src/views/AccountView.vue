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
        <TokenBalances :account="account" />
        <UserList />
        <TransactionHistory :account="account" />
      </b-container>
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
