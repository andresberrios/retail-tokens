<template>
  <div>
    <b-container class="my-5">
      <b-row>
        <b-col v-for="token in tokens" :key="token.name">
          <span>{{ token.value }}</span>
          <b-avatar size="1.5em">
            <svg :data-jdenticon-value="token.name" width="1.5em" height="1.5em" />
          </b-avatar>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TokenBalance extends Vue {
  tokens: unknown[] = [
    { name: "chanchi", value: "7,567.0000 CHT" },
    { name: "chiqui", value: "5,567.0000 CHQ" },
    { name: "eosio", value: "2,567.0000 EOS" },
    { name: "kitty", value: "10,567.0000 KITY" },
    { name: "pizza", value: "7,567.0000 PIZZA" },
    { name: "coffee", value: "7,567.0000 CFE" }
  ];
}
</script>

<style></style>
