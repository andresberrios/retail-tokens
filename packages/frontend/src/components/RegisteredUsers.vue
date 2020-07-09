<template>
  <div class="py-3">
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else-if="users && users.length === 0">
      <p>No registered users</p>
    </div>
    <div v-else>
      <b-input-group class="mb-3">
        <b-row class="align-content-center">
          <b-col sm="6">
            <label for="amount">Enter the amount:</label>
          </b-col>
          <b-col sm="5">
            <b-form-input v-model="amount" id="amount" type="number">
            </b-form-input>
          </b-col>
        </b-row>
      </b-input-group>
      <b-row>
        <b-col> </b-col>
      </b-row>
      <b-list-group>
        <b-list-group-item v-for="user in users" :key="user.account">
          <b-row>
            <b-col sm="2">
              <router-link
                :to="{ name: 'account', params: { account: user.account } }"
              >
                <Avatar size="2em" :value="user.account" type="account" />
                {{ user.account }}
              </router-link>
            </b-col>
            <b-col sm="2">
              <b-button class="ml-3">Send Token</b-button>
            </b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Avatar from "./Avatar.vue";

@Component({
  components: { Avatar }
})
export default class RegisteredUsers extends Vue {
  @Prop({ required: true })
  token!: string;

  amount = 0;
  users:
    | { _id: string; token: string; account: string; email: string }[]
    | null = null;

  loading = true;

  @Watch("token", { immediate: true })
  async loadRegisteredUsers() {
    this.loading = true;
    const registeredUsers = await this.$client.getPendingRegistrations(
      this.token
    );
    this.users = registeredUsers;
    this.loading = false;
  }
}
</script>
