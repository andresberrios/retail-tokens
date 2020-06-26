<template>
  <div>
    <b-container>
      <b-list-group>
        <b-list-group-item v-for="user in users" :key="user.id">
          <b-avatar button @click="onClick" size="2em">
            <svg :data-jdenticon-value="user.name" width="2em" height="2em" />
          </b-avatar>
          <a class="mx-2" href="#">{{ user.name }}</a>
          <b-icon icon="arrow-right"></b-icon>
          <span class="mx-2">{{ user.amount }}</span>
        </b-list-group-item>
      </b-list-group>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class UserList extends Vue {
  users: unknown[] = [
    { name: "chanchibon", id: "12345", amount: "2.0000 RTO" },
    { name: "chiquipiqui", id: "11112", amount: "5.0000 RTO" },
    { name: "coolioboy", id: "22345", amount: "6.0000 RTO" },
    { name: "ohyeaah", id: "42345", amount: "3.0000 RTO" },
    { name: "tokenlover", id: "52345", amount: "1.0000 RTO" }
  ];
}
</script>

<style></style>
