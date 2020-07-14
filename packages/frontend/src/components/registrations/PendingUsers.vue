<template>
  <div>
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else-if="pendingUsers.length === 0">
      <p>No users pending reward</p>
    </div>
    <div v-else>
      <h3>Users pending reward</h3>
      <b-form inline class="my-4">
        <label for="amount">Enter the amount:</label>
        <b-input v-model="amount" id="amount" type="number" class="ml-3" />
      </b-form>
      <b-table-simple
        hover
        responsive
        class="m-0"
        style="border-bottom: 1px solid rgba(0, 0, 0, 0.6)"
      >
        <b-thead>
          <b-tr class="bg-dark">
            <b-th>Account</b-th>
            <b-th>Email</b-th>
            <b-th>Send Token</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="user in pendingUsers" :key="user._id">
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
              <b-button size="sm" @click="sendToken(user.account, user._id)">
                Send Token
              </b-button>
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
import { TraversableResultSet } from "../../services/resultSet";

@Component({
  components: { Avatar }
})
export default class PendingUsers extends Vue {
  @Prop({ required: true })
  token!: string;

  amount = 0;
  result: TraversableResultSet<Registration> | null = null;

  loading = true;

  async sendToken(account: string, id: string) {
    try {
      const registration = await this.$client.giveTokens(
        `${this.amount} ${this.token}`,
        account,
        id
      );
      this.removeUser(account);
      this.$emit("rewarded", registration);
    } catch (error) {
      if (error.code === "SERVER_ERROR") {
        this.$root.$bvToast.toast("Failed to mark the user as rewarded!", {
          title: "Error",
          variant: "danger"
        });
      }
    }
  }

  get pendingUsers(): Registration[] {
    return !this.result ? [] : this.result.rows;
  }

  removeUser(account: string) {
    if (this.result) {
      this.result.rows = this.result.rows.filter(
        reg => reg.account !== account
      );
    }
  }

  @Watch("token", { immediate: true })
  async loadRegisteredUsers() {
    this.loading = true;
    this.result = await this.$client.getPendingRegistrations(this.token);
    this.loading = false;
  }

  async loadMore() {
    await this.result?.fetchMore();
  }
}
</script>
<style scoped></style>
