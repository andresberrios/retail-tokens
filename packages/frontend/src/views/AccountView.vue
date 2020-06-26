<template>
  <div>
    <b-container class="my-5">
      <b-avatar size="4em">
        <svg data-jdenticon-value="eosio" width="4em" height="4em" />
      </b-avatar>
      <span class="mr-auto">User Name</span>
    </b-container>
    <TokenBalance />
    <TransactionHistory />
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import TokenBalance from "../components/TokenBalance.vue";
import TransactionHistory from "../components/TransactionHistory.vue";

@Component({
  components: { TokenBalance, TransactionHistory }
})
export default class AccountView extends Vue {
  mounted() {
    window.jdenticon();
  }
}
</script>

<style></style>
