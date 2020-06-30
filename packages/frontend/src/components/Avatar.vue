<template>
  <b-avatar
    variant="dark"
    :size="size"
    :rounded="type === 'account'"
    :class="{ token: type === 'token' }"
  >
    <svg ref="frame" :width="size" :height="size" />
  </b-avatar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Avatar extends Vue {
  @Prop({ required: true })
  size!: string;

  @Prop({ required: true })
  value!: string;

  @Prop({ default: "account" })
  type!: "account" | "token";

  draw() {
    const win = window as {
      jdenticon?: { update: (element: Element, value: string) => void };
    };
    if (win.jdenticon) {
      win.jdenticon.update(this.$refs.frame as Element, this.value);
    }
  }

  async mounted() {
    if (document.readyState === "complete") {
      this.draw();
    } else {
      await new Promise(r =>
        window.addEventListener("load", r, { once: true })
      );
      this.draw();
    }
  }
}
</script>

<style scoped>
.token {
  border: solid gold 2px;
}
</style>
