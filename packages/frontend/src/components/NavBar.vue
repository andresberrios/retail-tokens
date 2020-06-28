<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand :to="{ name: 'home' }">{{ appName }}</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input
              size="md"
              class="mr-sm-2"
              placeholder="Search by account / token"
            ></b-form-input>
            <b-button size="md" class="my-2 my-sm-0" type="submit">
              Search
            </b-button>
          </b-nav-form>
          <b-nav-item>Log In</b-nav-item>
          <b-nav-item href="/account/:id" active-class="active">
            User
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class NavBar extends Vue {
  appName = process.env.VUE_APP_NAME || "Retail Tokens";
}
</script>

<style></style>
