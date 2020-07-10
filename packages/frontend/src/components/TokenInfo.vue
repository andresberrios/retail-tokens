<template>
  <div>
    <b-tabs content-class="mt-3">
      <b-tab title="Token Transactions" active>
        <TokenHistory :token="token" class="my-5" />
      </b-tab>
      <b-tab title="Token Holders" lazy>
        <TokenHolders :token="token" class="my-5" />
      </b-tab>
      <b-tab v-if="isTokenIssuer" title="Registered Users" lazy>
        <RegisteredUsers :token="token" class="my-4" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Avatar from "./Avatar.vue";
import TokenHistory from "./TokenHistory.vue";
import TokenHolders from "./TokenHolders.vue";
import RegisteredUsers from "./RegisteredUsers.vue";

@Component({
  components: { Avatar, TokenHistory, TokenHolders, RegisteredUsers }
})
export default class TokenInfo extends Vue {
  @Prop({ required: true })
  token!: string;

  get isTokenIssuer() {
    return this.$store.getters.isCurrentUserTokenIssuer(this.token);
  }
}
</script>

<style></style>
