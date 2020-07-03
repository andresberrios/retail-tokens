<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand :to="{ name: 'home' }">{{ appName }}</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="mr-auto">
          <b-nav-form @submit.prevent="goToAccount(searchedAccount)">
            <b-form-input
              size="md"
              class="mr-sm-2"
              placeholder="Search account"
              v-model="searchedAccount"
            ></b-form-input>
            <b-button size="md" class="my-2 my-sm-0" type="submit">
              Search
            </b-button>
          </b-nav-form>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!loggedIn" @click="logIn()">Log In</b-nav-item>
          <b-nav-item
            v-if="loggedIn"
            :to="{ name: 'account', params: { account } }"
          >
            {{ account }}
          </b-nav-item>
          <b-nav-item v-if="loggedIn" @click="logOut()">Log Out</b-nav-item>
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

  searchedAccount = "";

  goToAccount(account: string) {
    this.$router.push({ name: "account", params: { account } });
  }

  get loggedIn() {
    return this.$store.getters.loggedIn;
  }

  get account() {
    return this.$store.state.account?.actor;
  }

  async logIn() {
    try {
      await this.$store.dispatch("logIn");
    } catch (error) {
      this.$root.$bvToast.toast("Could not connect to wallet", {
        title: "Login unsuccessful",
        variant: "warning"
      });
    }
  }

  async logOut() {
    await this.$store.dispatch("logOut");
  }
}
</script>

<style></style>
