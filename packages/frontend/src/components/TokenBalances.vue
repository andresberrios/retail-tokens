<template>
  <div>
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else>
      <h4>Token Balance</h4>
      <b-card class="my-3">
        <b-row class="my-2">
          <b-col
            sm="2"
            v-for="token in tokens"
            :key="token"
            class="text-center"
          >
            <Avatar size="3.5em" :value="token.split(' ')[1]" type="token" />
            <div class="mt-2">
              {{ token.split(" ")[0] }}
              <strong>{{ token.split(" ")[1] }}</strong>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Avatar from "../components/Avatar.vue";

@Component({
  components: { Avatar }
})
export default class TokenBalances extends Vue {
  @Prop({ required: true })
  account!: string;

  tokens: string[] | null = null;
  loading = true;

  @Watch("account", { immediate: true })
  async loadBalances() {
    const data = await this.$client.getTokens(this.account);
    await data.fetchRest();
    this.tokens = data.rows;
    this.loading = false;
  }
}
</script>

<style></style>
