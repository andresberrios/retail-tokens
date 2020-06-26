<template>
  <div>
    <Navbar />
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
export default class AccountView extends Vue {}
</script>

<style></style>
