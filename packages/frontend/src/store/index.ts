import Vue from "vue";
import Vuex from "vuex";
import { connectAnchor, restoreAnchorSession } from "./anchor";
import { TokenStats } from "../services/client";
import { V2_GET_CREATED_ACCOUNTS } from "@eoscafe/hyperion";

Vue.use(Vuex);

export default new Vuex.Store<{
  account: {
    actor: string;
    permission: string;
  } | null;
  allTokens: TokenStats[] | null;
  allTokensLoading: boolean;
}>({
  state: {
    account: null,
    allTokens: null,
    allTokensLoading: false
  },
  getters: {
    loggedIn(state) {
      return state.account !== null;
    },
    getIssuedTokens: state => (account: string) => {
      return state.allTokens?.filter(t => t.issuer === account) || [];
    },
    isCurrentUserTokenIssuer: state => (token: string) => {
      if (state.account === null) {
        return false;
      }
      const stats = state.allTokens?.find(t => t.symbol === token);
      if (!stats) {
        return false;
      }
      return state.account.actor === stats.issuer;
    }
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
    },
    setAllTokens(state, tokens) {
      state.allTokens = tokens;
    },
    setAllTokensLoading(state, loaded) {
      state.allTokensLoading = loaded;
    }
  },
  actions: {
    async logIn({ commit }) {
      const result = await connectAnchor();
      Vue.$client.session = result.session;
      commit("setAccount", result.session.auth);
    },
    async restoreSession({ commit }) {
      const session = await restoreAnchorSession();
      if (session) {
        Vue.$client.session = session;
        commit("setAccount", session.auth);
      }
    },
    async logOut({ commit }) {
      await Vue.$client.session?.remove();
      delete Vue.$client.session;
      commit("setAccount", null);
    },
    async loadAllTokens({ commit }) {
      commit("setAllTokensLoading", true);
      const results = await Vue.$client.getAllTokenStats();
      await results.fetchRest();
      commit("setAllTokens", results.rows);
      commit("setAllTokensLoading", false);
    }
  }
});
