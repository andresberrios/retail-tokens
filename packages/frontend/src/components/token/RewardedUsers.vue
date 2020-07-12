<template>
  <div>
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else-if="rewardedUsers && rewardedUsers.length === 0">
      <p>No users rewarded yet</p>
    </div>
    <div v-else>
      <h3>Rewarded users</h3>
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
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Avatar from "../Avatar.vue";
import { Registration } from "../../services/client";

@Component({
  components: { Avatar }
})
export default class RewardedUsers extends Vue {
  @Prop({ required: true })
  token!: string;

  rewardedUsers: Registration[] | null = null;
  loading = true;

  addUser(user: Registration) {
    this.rewardedUsers?.unshift(user);
  }

  @Watch("token", { immediate: true })
  async loadRewardedUsers() {
    this.loading = true;
    this.rewardedUsers = await this.$client.getRewardedRegistrations(
      this.token
    );
    this.loading = false;
  }
}
</script>
