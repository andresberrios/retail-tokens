<template>
  <b-container class="py-5">
    <div class="d-flex align-items-center">
      <Avatar size="4em" :value="token" type="token" />
      <h2 class="m-0 ml-3 text-light">{{ token }}</h2>
      <b-button
        class="ml-auto"
        variant="outline-success"
        :to="{ name: 'register', params: { token } }"
      >
        Register
      </b-button>
    </div>
    <hr class="my-4" id="separator" />
    <TokenInfo :token="token" />
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import TokenInfo from "../components/token/TokenInfo.vue";
import Avatar from "../components/Avatar.vue";

@Component({
  components: { TokenInfo, Avatar }
})
export default class TokenView extends Vue {
  @Prop({ required: true })
  token!: string;
}
</script>

<style scoped>
#separator {
  border-color: #7a8288;
}
</style>
