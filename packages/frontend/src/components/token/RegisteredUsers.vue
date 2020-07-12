<template>
  <div>
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else>
      <PendingUsers :token="token" @rewarded="onRewarded($event)" />
      <RewardedUsers :token="token" class="mt-5" ref="rewarded" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import PendingUsers from "./PendingUsers.vue";
import RewardedUsers from "./RewardedUsers.vue";
import { Registration } from "../../services/client";

export default interface RegisteredUsers {
  $refs: { rewarded: RewardedUsers };
}

@Component({
  components: { PendingUsers, RewardedUsers }
})
export default class RegisteredUsers extends Vue {
  @Prop({ required: true })
  token!: string;

  loading = true;

  onRewarded(user: Registration) {
    this.$refs.rewarded.addUser(user);
  }

  @Watch("token", { immediate: true })
  async loadAllUsers() {
    this.loading = true;
    this.loading = false;
  }
}
</script>
