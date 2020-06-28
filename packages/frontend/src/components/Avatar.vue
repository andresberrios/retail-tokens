<template>
  <b-avatar variant="dark" rounded :size="size">
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

<style></style>
