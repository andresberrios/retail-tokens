<template>
  <div>
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else-if="rewardedUsers.length === 0">
      <p>No users rewarded yet</p>
    </div>
    <div v-else>
      <h3>Rewarded users</h3>
      <b-table-simple
        hover
        responsive
        class="mt-4 mb-0"
        style="border-bottom: 1px solid rgba(0, 0, 0, 0.6)"
        ><b-thead>
          <b-tr class="bg-dark">
            <b-th>Account</b-th>
            <b-th>Email</b-th>
            <b-th>Rewarded At</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="user in rewardedUsers" :key="user._id">
            <b-td>
              <router-link
                :to="{ name: 'account', params: { account: user.account } }"
              >
                <Avatar size="2em" :value="user.account" type="account" />
                {{ user.account }}
              </router-link>
            </b-td>
            <b-td>
              {{ user.email }}
            </b-td>
            <b-td>
              {{ user.rewardedAt }}
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <div v-if="result.more" class="p-3 text-center">
        <div v-if="result.loadingMore" class="text-light">
          <b-spinner variant="light" class="align-middle mr-2" />
          <strong>Loading...</strong>
        </div>
        <b-button v-else size="sm" @click="loadMore">
          Load more
        </b-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Avatar from "../Avatar.vue";
import { Registration } from "../../services/client";
import { formatDate } from "../../services/dateFormatter";
import { TraversableResultSet } from "../../services/resultSet";

@Component({
  components: { Avatar }
})
export default class RewardedUsers extends Vue {
  @Prop({ required: true })
  token!: string;

  result: TraversableResultSet<Registration> | null = null;
  loading = true;

  addUser(user: Registration) {
    this.result?.rows.unshift(user);
  }

  get rewardedUsers(): Registration[] {
    return this.result === null
      ? []
      : this.result.rows.map(r => ({
          ...r,
          rewardedAt: formatDate(r.rewardedAt)
        }));
  }

  async loadMore() {
    await this.result?.fetchMore();
  }

  @Watch("token", { immediate: true })
  async loadRewardedUsers() {
    this.loading = true;
    this.result = await this.$client.getRewardedRegistrations(this.token);
    this.loading = false;
  }
}
</script>
