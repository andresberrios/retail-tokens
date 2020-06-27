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
      >
        <template v-slot:cell(from)="data">
          <router-link
            :to="{ name: 'account', params: { account: data.value } }"
          >
            <Avatar size="2em" :value="data.value" />
            <!-- <b-avatar size="2em">
              <svg
                :data-jdenticon-value="data.value"
                width="2em"
                height="2em"
              />
            </b-avatar> -->
            {{ data.value }}
          </router-link>
        </template>
        <template v-slot:cell(to)="data">
          <router-link
            :to="{ name: 'account', params: { account: data.value } }"
          >
            <Avatar size="2em" :value="data.value" />
            {{ data.value }}
          </router-link>
        </template>
      </b-table>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Avatar from "../components/Avatar.vue";

@Component({
  components: { Avatar }
})
export default class TransactionHistory extends Vue {
  fields = [{ label: "ID", key: "id" }, "date", "from", "to", "amount", "memo"];
  items: unknown[] = [
    {
      id: "12aabbcc",
      date: "25062020",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12abbcdc",
      date: "26062020",
      to: "andres",
      from: "santi",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    },
    {
      id: "12aabbcc",
      date: "25062020",
      to: "santi",
      from: "andres",
      amount: "3000EOS"
    }
  ];
}
</script>

<style></style>
