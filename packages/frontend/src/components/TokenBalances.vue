<template>
  <div>
    <b-container class="my-5">
      <b-row>
        <b-col v-for="token in tokens && tokens.rows" :key="token">
          <span>{{ token }}</span>
          <Avatar size="1.5em" :value="token.split(' ')[1]" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Avatar from "../components/Avatar.vue";

@Component({
  components: { Avatar }
})
export default class TokenBalances extends Vue {
  tokens: { more: boolean; next_key: string; rows: unknown[] } | null = null;

  async mounted() {
    this.tokens = await this.$client.getTokens(this.$route.params.account);
  }
}
</script>

<style></style>
