<template>
  <div>
    <b-container class="my-5">
      <b-row>
        <b-col v-for="token in tokens" :key="token">
          <span>{{ token }}</span>
          <Avatar size="1.5em" :value="token.split(' ')[1]" />
        </b-col>
      </b-row>
    </b-container>
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

  @Watch("account", { immediate: true })
  async loadBalances() {
    const data = await this.$client.getTokens(this.account);
    await data.fetchRest();
    this.tokens = data.rows;
  }
}
</script>

<style></style>
