<template>
  <div id="app">
    <div id="nav">
      <NavBar />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "../src/components/NavBar.vue";

@Component({
  components: { NavBar }
})
export default class App extends Vue {}
</script>

<style lang="scss"></style>
