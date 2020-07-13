<template>
  <div>
    <PendingUsers :token="token" @rewarded="onRewarded($event)" />
    <RewardedUsers :token="token" class="mt-5" ref="rewarded" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import PendingUsers from "./PendingUsers.vue";
import RewardedUsers from "./RewardedUsers.vue";
import { Registration } from "../../services/client";

export default interface RegisteredUsers {
  $refs: { rewarded: RewardedUsers };
}

@Component({
  components: { PendingUsers, RewardedUsers }
})
export default class Registrations extends Vue {
  @Prop({ required: true })
  token!: string;

  onRewarded(user: Registration) {
    this.$refs.rewarded.addUser(user);
  }
}
</script>
