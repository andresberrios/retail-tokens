import ScatterJS from "@scatterjs/core";
import ScatterEOS from "@scatterjs/eosjs2";

import { JsonRpc, Api } from "eosjs";

ScatterJS.plugins(new ScatterEOS());

export async function connectScatter(): Promise<{
  eos: Api;
  account: { actor: string; permission: string };
}> {
  const network = ScatterJS.Network.fromJson({
    blockchain: "eos",
    chainId: process.env.VUE_APP_CHAIN_ID,
    host: process.env.VUE_APP_NODE_HOST,
    port: process.env.VUE_APP_NODE_PORT,
    protocol: process.env.VUE_APP_NODE_PROTOCOL
  });
  const rpc = new JsonRpc(network.fullhost());

  const connected: boolean = await ScatterJS.connect(process.env.VUE_APP_NAME, {
    network
  });
  if (!connected) {
    throw new Error("Scatter not found");
  }

  const eos = ScatterJS.eos(network, Api, { rpc });

  const id = await ScatterJS.login();
  if (!id) {
    throw new Error("No identity provided from Scatter");
  }
  const account = ScatterJS.account("eos");

  return {
    eos,
    account: { actor: account.name, permission: account.authorization }
  };
}
