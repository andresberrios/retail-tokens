<template>
  <div>
    <div v-if="loading">
      <b-spinner label="Spinning"></b-spinner>
      Loading...
    </div>
    <div v-else>
      <h4>Token Balance</h4>
      <b-card class="my-3">
        <div class="d-flex my-2">
          <b-row>
            <b-col v-for="token in tokens" :key="token">
              <span>{{ token }}</span>
              <Avatar
                class="mx-1"
                size="1.5em"
                :value="token.split(' ')[1]"
                type="token"
              />
            </b-col>
          </b-row>
        </div>
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
