<template>
  <div id="app" class="d-flex flex-column">
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

<style>
#app {
  min-height: 100vh;
}
</style>
