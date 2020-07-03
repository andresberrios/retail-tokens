<template>
  <div>
    <b-tabs content-class="mt-3">
      <b-tab title="Token" active>
        <TokenHistory :token="token" />
      </b-tab>
      <b-tab title="User List">
        <UserList :token="token" />
      </b-tab>
      <b-tab title="Registered Users">
        <RegisteredUsers />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Avatar from "./Avatar.vue";
import TokenHistory from "./TokenHistory.vue";
import UserList from "./UserList.vue";
import RegisteredUsers from "./RegisteredUsers.vue";

@Component({
  components: { Avatar, TokenHistory, UserList, RegisteredUsers }
})
export default class TokenInfo extends Vue {
  @Prop({ required: true })
  token!: string;
}
</script>

<style></style>
