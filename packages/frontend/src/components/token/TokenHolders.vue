<template>
  <div>
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else-if="users && users.length === 0">
      <p>There are no token holders of this token.</p>
    </div>
    <b-list-group v-else>
      <b-list-group-item v-for="user in users" :key="user.account">
        <router-link
          :to="{ name: 'account', params: { account: user.account } }"
        >
          <Avatar size="2em" :value="user.account" type="account" />
          {{ user.account }}
        </router-link>
        <b-icon icon="arrow-right"></b-icon>
        <router-link
          :to="{
            name: 'token',
            params: { token: user.balance.split(' ')[1] }
          }"
          ><span class="mx-2">{{ user.balance }}</span>
        </router-link>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Avatar from "../Avatar.vue";
import { TokenHolder } from "../../services/client";

@Component({
  components: { Avatar }
})
export default class UserList extends Vue {
  @Prop({ required: true })
  token!: string;

  users: TokenHolder[] | null = null;

  loading = true;

  @Watch("token", { immediate: true })
  async loadUsers() {
    this.loading = true;
    const tokenHolders = await this.$client.getTokenHolders(this.token);
    this.users = tokenHolders.rows;
    this.loading = false;
  }
}
</script>

<style></style>
