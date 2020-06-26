/// <reference types="./types" />

import { EosUp } from "eosup";
import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import fetch from "node-fetch";
import { TextDecoder, TextEncoder } from "util";

async function deploy() {
  const rpc = new JsonRpc(process.env.NODE_ENDPOINT || "", { fetch });
  const eos = new Api({
    rpc,
    signatureProvider: new JsSignatureProvider([process.env.PRIVATE_KEY || ""]),
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder() as never
  });

  const up = new EosUp({ eos });

  await up.setContract(
    process.env.CONTRACT_ACCOUNT || "",
    "./build/eosio.token.wasm"
  );
}

deploy().catch(e => {
  console.error(e);
  process.exit(1);
});
