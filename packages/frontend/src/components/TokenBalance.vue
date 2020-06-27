<template>
  <div>
    <b-container class="my-5">
      <b-row>
        <b-col v-for="token in tokens && tokens.rows" :key="token.balance">
          <span>{{ token.balance }}</span>
          <Avatar size="1.5em" :value="token.balance.split(' ')[1]" />
          <!-- <b-avatar size="1.5em">
            <svg
              :data-jdenticon-value="token.balance.split(' ')[1]"
              width="1.5em"
              height="1.5em"
            />
          </b-avatar> -->
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BlockchainClient from "../services/client";
import Avatar from "../components/Avatar.vue";

@Component({
  components: { Avatar }
})
export default class TokenBalance extends Vue {
  client = new BlockchainClient();
  tokens: { more: boolean; next_key: string; rows: unknown[] } | null = null;

  async mounted() {
    this.tokens = await this.client.getTokens(this.$route.params.account);
  }
}
</script>

<style></style>
