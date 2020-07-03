<template>
  <div>
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else>
      <b-container>
        <b-list-group>
          <b-list-group-item v-for="user in users" :key="user.account">
            <router-link
              :to="{ name: 'account', params: { account: user.account } }"
            >
              <Avatar size="2em" :value="user.account" />
              {{ user.account }}
            </router-link>
            <b-icon icon="arrow-right"></b-icon>
            <span class="mx-2">{{ user.balance }}</span>
          </b-list-group-item>
        </b-list-group>
      </b-container>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Avatar from "../components/Avatar.vue";
import { TokenHolder } from "../services/client";

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
    const tokenHolders = await this.$client.getTokenHolders(this.token);
    this.users = tokenHolders.rows;
    this.loading = false;
  }
}
</script>

<style></style>
