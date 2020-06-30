<template>
  <div>
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else>
      <b-container>
        <b-list-group>
          <b-list-group-item v-for="user in users" :key="user.id">
            <router-link
              :to="{ name: 'account', params: { account: user.name } }"
            >
              <Avatar size="2em" :value="user.name" />
              {{ user.name }}
            </router-link>
            <b-icon icon="arrow-right"></b-icon>
            <span class="mx-2">{{ user.amount }}</span>
          </b-list-group-item>
        </b-list-group>
      </b-container>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Avatar from "../components/Avatar.vue";

@Component({
  components: { Avatar }
})
export default class UserList extends Vue {
  users: unknown[] = [
    { name: "chanchibon", id: "12345", amount: "2.0000 RTO" },
    { name: "chiquipiqui", id: "11112", amount: "5.0000 RTO" },
    { name: "coolioboy", id: "22345", amount: "6.0000 RTO" },
    { name: "ohyeaah", id: "42345", amount: "3.0000 RTO" },
    { name: "tokenlover", id: "52345", amount: "1.0000 RTO" }
  ];

  loading = true;

  async mounted() {
    await new Promise(r => setTimeout(r, 1000));
    this.loading = false;
  }
}
</script>

<style></style>
