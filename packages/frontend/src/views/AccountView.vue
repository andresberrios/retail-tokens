<template>
  <div>
    <b-container class="my-5">
      <Avatar size="4em" :value="account" />
      <span class="mr-auto">{{ account }}</span>
    </b-container>
    <TokenBalances />
    <UserList />
    <TransactionHistory :account="account" />
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
}
</script>

<style></style>
