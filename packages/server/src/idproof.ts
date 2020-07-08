/// <reference types="./serverTypes" />

import { recover } from "eosjs-ecc";
import { Api, JsonRpc, Numeric } from "eosjs";
import fetch from "node-fetch";

const chainId = process.env.CHAIN_ID || "";
const contract = process.env.CONTRACT_ACCOUNT || "";

const eos = new Api({
  chainId,
  rpc: new JsonRpc(process.env.CHAIN_NODE || "", { fetch }),
  signatureProvider: null as never
});

interface Authorization {
  actor: string;
  permission: string;
}

interface AccountPermission {
  perm_name: string;
  parent: string;
  required_auth: {
    threshold: number;
    keys: [
      {
        key: string;
        weight: number;
      }
    ];
    accounts: unknown[];
    waits: unknown[];
  };
}

interface AccountInfo {
  account_name: string;
  created: string;
  permissions: AccountPermission[];
}

interface TokenStats {
  symbol: string;
  supply: string;
  max_supply: string;
  issuer: string;
}

/**
 * Ensure public key is in new PUB_ format.
 * @internal
 */
function normalizePublicKey(key: string) {
  if (key.startsWith("PUB_")) {
    return key;
  }
  return Numeric.publicKeyToString(
    Numeric.stringToPublicKey("EOS" + key.substr(-50))
  );
}

/**
 * Return true if given public keys are equal.
 * @internal
 */
function publicKeyEqual(keyA: string, keyB: string) {
  return normalizePublicKey(keyA) === normalizePublicKey(keyB);
}

/**
 * Format a EOSIO permission level in the format `actor@permission` taking placeholders into consideration.
 * @internal
 */
function formatAuth(auth: Authorization): string {
  let { actor, permission } = auth;
  if (actor === "............1") {
    actor = "<any>";
  }
  if (permission === "............1" || permission === "............2") {
    permission = "<any>";
  }
  return `${actor}@${permission}`;
}

export async function validateIdentity(
  transaction: Uint8Array,
  signature: string
): Promise<Authorization> {
  const blob = Buffer.concat([
    Buffer.from(chainId, "hex"),
    Buffer.from(transaction),
    Buffer.alloc(32)
  ]);

  const {
    actions: [action]
  }: {
    actions: Array<{
      account: string;
      name: string;
      authorization: Authorization[];
    }>;
  } = eos.deserializeTransaction(transaction);
  if (action.account !== "" || action.name !== "identity") {
    throw new TypeError("Wrong type of action provided");
  }
  const [signer] = action.authorization;
  const signerKey = recover(signature, blob);

  let account: AccountInfo;
  try {
    account = await eos.rpc.get_account(signer.actor);
  } catch (error) {
    throw new Error(`Could not retrieve account information: ${signer.actor}`);
  }
  const permission = account.permissions.find(
    perm => perm.perm_name === signer.permission
  );
  if (!permission) {
    throw new Error(
      `${signer.actor} signed for unknown permission: ${signer.permission}`
    );
  }
  const auth = permission.required_auth;
  const keyAuth = auth.keys.find(({ key }) => publicKeyEqual(key, signerKey));
  if (!keyAuth) {
    throw new Error(`${formatAuth(signer)} has no key matching id signature`);
  }
  if (auth.threshold > keyAuth.weight) {
    throw new Error(
      `${formatAuth(signer)} signature does not reach auth threshold`
    );
  }
  return signer;
}

export async function getTokenStats(
  token: string
): Promise<TokenStats | undefined> {
  const { [token]: stats } = await eos.rpc.get_currency_stats(contract, token);
  if (!stats) {
    return undefined;
  }
  stats.symbol = token;
  return stats;
}

export async function tokenExists(token: string) {
  try {
    const { [token]: stats } = await eos.rpc.get_currency_stats(
      contract,
      token
    );
    return !!stats;
  } catch (error) {
    return false;
  }
}

export async function accountExists(account: string) {
  try {
    await eos.rpc.get_account(account);
    return true;
  } catch (error) {
    return false;
  }
}
