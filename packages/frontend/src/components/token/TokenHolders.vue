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
      <div v-if="result.more" class="text-center mt-3">
        <div v-if="result.loadingMore" class="text-light">
          <b-spinner variant="light" class="align-middle mr-2" />
          <strong>Loading...</strong>
        </div>
        <b-button v-else size="sm" @click="loadMore">
          Load more
        </b-button>
      </div>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Avatar from "../Avatar.vue";
import { TokenHolder } from "../../services/client";
import { TraversableResultSet } from "../../services/resultSet";

@Component({
  components: { Avatar }
})
export default class UserList extends Vue {
  @Prop({ required: true })
  token!: string;

  result: TraversableResultSet<TokenHolder> | null = null;

  loading = true;
  loadingMore = false;

  get users(): TokenHolder[] {
    return !this.result ? [] : this.result.rows;
  }

  async loadMore() {
    await this.result?.fetchMore();
  }

  @Watch("token", { immediate: true })
  async loadInitialUsers() {
    this.loading = true;
    this.result = await this.$client.getTokenHolders(this.token);
    this.loading = false;
  }
}
</script>

<style></style>
