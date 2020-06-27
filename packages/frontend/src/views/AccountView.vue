<template>
  <div>
    <b-container class="my-5">
      <Avatar size="4em" :value="account" />
      <!-- <b-avatar size="4em">
        <svg data-jdenticon-value="eosio" width="4em" height="4em" />
      </b-avatar> -->
      <span class="mr-auto">{{ account }}</span>
    </b-container>
    <TokenBalance />
    <UserList />
    <TransactionHistory />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TokenBalance from "../components/TokenBalance.vue";
import TransactionHistory from "../components/TransactionHistory.vue";
import UserList from "../components/UserList.vue";
import Avatar from "../components/Avatar.vue";

@Component({
  components: { TokenBalance, TransactionHistory, UserList, Avatar }
})
export default class AccountView extends Vue {
  @Prop({ required: true })
  account!: string;
}
</script>

<style></style>
