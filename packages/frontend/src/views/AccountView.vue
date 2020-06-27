<template>
  <div>
    <b-container class="my-5">
      <b-avatar size="4em">
        <svg data-jdenticon-value="eosio" width="4em" height="4em" />
      </b-avatar>
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

@Component({
  components: { TokenBalance, TransactionHistory, UserList }
})
export default class AccountView extends Vue {
  @Prop({ required: true })
  account!: string;

  mounted() {
    const win = window as { jdenticon?: Function };
    if (win.jdenticon) {
      win.jdenticon();
    }
  }
}
</script>

<style></style>
