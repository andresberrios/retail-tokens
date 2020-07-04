<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "../src/components/NavBar.vue";

@Component({
  components: { NavBar }
})
export default class App extends Vue {
  async mounted() {
    await Promise.all([
      this.$store.dispatch("loadAllTokens"),
      this.$store.dispatch("restoreSession")
    ]);
  }
}
</script>

<style></style>
