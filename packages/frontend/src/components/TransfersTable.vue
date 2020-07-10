<template>
  <div>
    <b-table
      hover
      :items="transfers"
      :fields="fields"
      :bordered="true"
      head-variant="dark"
      table-variant="dark"
      stacked="sm"
    >
      <template v-slot:cell(from)="data">
        <router-link :to="{ name: 'account', params: { account: data.value } }">
          <Avatar size="2em" :value="data.value" type="account" />
          {{ data.value }}
        </router-link>
      </template>
      <template v-slot:cell(to)="data">
        <router-link :to="{ name: 'account', params: { account: data.value } }">
          <Avatar size="2em" :value="data.value" type="account" />
          {{ data.value }}
        </router-link>
      </template>
      <template v-slot:cell(amount)="data">
        <router-link
          :to="{ name: 'token', params: { token: data.value.split(' ')[1] } }"
        >
          {{ data.value }}
          <Avatar size="1.5em" :value="data.value.split(' ')[1]" type="token" />
        </router-link>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Avatar from "../components/Avatar.vue";

export interface Transfer {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: string;
  memo: string;
}

@Component({
  components: { Avatar }
})
export default class TransfersTable extends Vue {
  @Prop({ required: true })
  transfers!: Transfer[];

  fields = [{ label: "ID", key: "id" }, "date", "from", "to", "amount", "memo"];
}
</script>

<style></style>
