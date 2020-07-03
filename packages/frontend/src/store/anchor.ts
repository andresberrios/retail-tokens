import AnchorLink, { LinkSession } from "anchor-link";
import AnchorLinkBrowserTransport from "anchor-link-browser-transport";

const appName = process.env.VUA_APP_NAME || "frontend";

const transport = new AnchorLinkBrowserTransport();
const link = new AnchorLink({
  transport,
  chainId: process.env.VUE_APP_CHAIN_ID,
  rpc: process.env.VUE_APP_CHAIN_NODE
});

export async function connectAnchor() {
  const result = await link.login(appName);
  result.session.metadata.proof = {
    transaction: Array.from(result.serializedTransaction),
    signature: result.signatures[0]
  };
  ((link as unknown) as {
    storeSession(identifier: string, session: LinkSession): Promise<void>;
  }).storeSession(appName, result.session);
  return result;
}

export async function restoreAnchorSession() {
  return link.restoreSession(appName);
}
