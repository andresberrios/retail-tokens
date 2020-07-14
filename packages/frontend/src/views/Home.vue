<template>
  <b-container class="py-5">
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center"
    >
      <b-spinner large variant="dark" label="Loading..."></b-spinner>
      <strong class="mx-2 color-dark">Loading...</strong>
    </div>
    <b-list-group v-else>
      <b-list-group-item v-for="token in tokens" :key="token.symbol">
        <b-row class="my-1">
          <b-col sm="2">
            <router-link
              :to="{ name: 'token', params: { token: token.symbol } }"
            >
              <Avatar size="2em" :value="token.symbol" type="token" />
              {{ token.symbol }}
            </router-link>
          </b-col>
          <b-col sm="2">
            <b-button
              variant="outline-success"
              :to="{ name: 'register', params: { token: token.symbol } }"
            >
              Register
            </b-button>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Avatar from "../components/Avatar.vue";
import TokenStats from "../services/client";

@Component({
  components: { Avatar }
})
export default class Home extends Vue {
  get tokens(): TokenStats[] {
    return this.$store.state.allTokens;
  }
  get loading(): boolean {
    return this.$store.state.allTokensLoading;
  }
}
</script>
