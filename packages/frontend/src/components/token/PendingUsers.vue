<template>
  <div>
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else-if="pendingUsers && pendingUsers.length === 0">
      <p>No users pending reward</p>
    </div>
    <div v-else>
      <h3>Users pending reward</h3>
      <b-form inline class="mt-4">
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
              <b-button
                size="sm"
                class="ml-3"
                @click="sendToken(user.account, user._id)"
              >
                Send Token
              </b-button>
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
export default class PendingUsers extends Vue {
  @Prop({ required: true })
  token!: string;

  amount = 0;
  pendingUsers: Registration[] | null = null;

  loading = true;

  async sendToken(account: string, id: string) {
    try {
      const registration = await this.$client.giveTokens(
        `${this.amount} ${this.token}`,
        account,
        id
      );
      if (this.pendingUsers) {
        this.pendingUsers = this.pendingUsers.filter(
          reg => reg.account !== account
        );
      }
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

  @Watch("token", { immediate: true })
  async loadRegisteredUsers() {
    this.loading = true;
    this.pendingUsers = await this.$client.getPendingRegistrations(this.token);
    this.loading = false;
  }
}
</script>
