<template>
  <div>
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else>
      <div v-if="pendingUsers && pendingUsers.length === 0">
        <p>No users pending reward</p>
      </div>
      <div v-else>
        <h2>Users pending reward</h2>
        <b-form inline>
          <label for="amount">Enter the amount:</label>
          <b-input v-model="amount" id="amount" type="number" class="ml-3" />
        </b-form>
        <b-list-group class="mt-3">
          <b-list-group-item v-for="user in pendingUsers" :key="user.account">
            <b-row>
              <b-col sm="4" lg="2">
                <router-link
                  :to="{ name: 'account', params: { account: user.account } }"
                >
                  <Avatar size="2em" :value="user.account" type="account" />
                  {{ user.account }}
                </router-link>
              </b-col>
              <b-col sm="4" md="3">
                {{ user.email }}
              </b-col>
              <b-col sm="4" md="3">
                <b-button size="sm" class="ml-3">Send Token</b-button>
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </div>
      <div v-if="rewardedUsers && rewardedUsers.length === 0">
        <p>No users rewarded yet</p>
      </div>
      <div v-else>
        <h2>Rewarded users</h2>
        <b-list-group class="mt-3">
          <b-list-group-item v-for="user in rewardedUsers" :key="user.account">
            <b-row>
              <b-col sm="4" lg="2">
                <router-link
                  :to="{ name: 'account', params: { account: user.account } }"
                >
                  <Avatar size="2em" :value="user.account" type="account" />
                  {{ user.account }}
                </router-link>
              </b-col>
              <b-col sm="4" md="3">
                {{ user.email }}
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Avatar from "../Avatar.vue";

interface Registration {
  _id: string;
  token: string;
  account: string;
  email: string;
}

@Component({
  components: { Avatar }
})
export default class RegisteredUsers extends Vue {
  @Prop({ required: true })
  token!: string;

  amount = 0;
  pendingUsers: Registration[] | null = null;
  rewardedUsers: Registration[] | null = null;

  loading = true;

  @Watch("token", { immediate: true })
  async loadRegisteredUsers() {
    this.loading = true;
    [this.pendingUsers, this.rewardedUsers] = await Promise.all([
      this.$client.getPendingRegistrations(this.token),
      this.$client.getRewardedRegistrations(this.token)
    ]);
    this.loading = false;
  }
}
</script>
