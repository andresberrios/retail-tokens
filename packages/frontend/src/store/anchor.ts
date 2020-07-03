import AnchorLink from "anchor-link";
import AnchorLinkBrowserTransport from "anchor-link-browser-transport";

const transport = new AnchorLinkBrowserTransport();
const link = new AnchorLink({
  transport,
  chainId: process.env.VUE_APP_CHAIN_ID,
  rpc: process.env.VUE_APP_CHAIN_NODE
});

export async function connectAnchor() {
  return link.login(process.env.VUE_APP_NAME);
}

export async function restoreAnchorSession() {
  return link.restoreSession(process.env.VUE_APP_NAME);
}
