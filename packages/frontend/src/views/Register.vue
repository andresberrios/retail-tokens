<template>
  <b-container class="py-5">
    <b-row class="justify-content-center align-items-center">
      <b-col sm="10" md="8" lg="6">
        <b-form @submit.prevent="submit">
          <div class="d-flex justify-content-center align-items-center">
            <Avatar size="4em" :value="token" type="token" />
            <h1 class="m-0 ml-3">{{ token }}</h1>
          </div>
          <h2 class="text-center my-4">Register to receive tokens</h2>
          <b-card>
            <b-form-group label="Telos account">
              <b-input-group>
                <b-input-group-prepend is-text>
                  <b-icon icon="person"></b-icon>
                </b-input-group-prepend>
                <b-input
                  v-model="registration.account"
                  placeholder="Enter your Telos account"
                  type="text"
                  maxlength="12"
                ></b-input>
              </b-input-group>
            </b-form-group>
            <b-form-group label="Email">
              <b-input-group>
                <b-input-group-prepend is-text>
                  <b-icon icon="envelope"></b-icon>
                </b-input-group-prepend>
                <b-input
                  id="email"
                  v-model="registration.email"
                  placeholder="Enter your email"
                  type="email"
                ></b-input>
              </b-input-group>
            </b-form-group>
            <b-button block size="lg" type="submit" variant="success">
              Submit
            </b-button>
          </b-card>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Avatar from "../components/Avatar.vue";

@Component({
  components: { Avatar }
})
export default class Register extends Vue {
  @Prop({ required: true })
  token!: string;

  registration = {
    email: "",
    account: ""
  };

  async submit() {
    await this.$client.submitRegistration(
      this.token,
      this.registration.account,
      this.registration.email
    );
  }
}
</script>
