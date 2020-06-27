<template>
  <b-avatar rounded :size="size">
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

  mounted() {
    const win = window as {
      jdenticon?: { update: (element: Element, value: string) => void };
    };
    if (win.jdenticon) {
      win.jdenticon.update(this.$refs.frame as Element, this.value);
    }
  }
}
</script>

<style></style>
