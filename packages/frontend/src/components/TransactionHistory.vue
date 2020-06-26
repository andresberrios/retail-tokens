<template>
  <div>
    <b-container class="my-5">
      <div>Transactions</div>
      <b-table
        hover
        :items="items"
        :fields="fields"
        :bordered="true"
        head-variant="dark"
        table-variant="dark"
        stacked="sm"
      ></b-table>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TransactionHistory extends Vue {
  fields = [
    { label: "ID", key: "id" },
    "date",
    "action",
    "to",
    "from",
    "amount",
    "memo"
  ];
  items: unknown[] = [
    {
      id: "12aabbcc",
      date: "25062020",
      action: "sent",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12abbcdc",
      date: "26062020",
      action: "received",
      to: "andres",
      from: "santi",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      action: "sent",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      action: "sent",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      action: "sent",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      action: "sent",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      action: "sent",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      action: "sent",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      action: "sent",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      action: "sent",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      action: "sent",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      action: "sent",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      action: "sent",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    }
  ];
}
</script>

<style></style>
