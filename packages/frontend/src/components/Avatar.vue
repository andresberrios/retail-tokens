<template>
  <b-avatar
    variant="dark"
    :size="size"
    :rounded="type === 'account'"
    :class="{ token: type === 'token', account: type === 'account' }"
  >
    <svg ref="frame" :width="size" :height="size" />
  </b-avatar>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { update } from "jdenticon";

@Component
export default class Avatar extends Vue {
  @Prop({ required: true })
  size!: string;

  @Prop({ required: true })
  value!: string;

  @Prop({ default: "account" })
  type!: "account" | "token";

  @Watch("value", { immediate: true })
  async valueChanged() {
    await this.$nextTick();
    update(this.$refs.frame as HTMLElement, this.value);
  }
}
</script>

<style scoped>
.token {
  border: solid gold 0.1em;
}
.account {
  border: solid rgb(179, 179, 179) 0.1em;
}
</style>
