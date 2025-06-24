import { type Peer, AdapterInternal } from "crossws";

const peers = new Map<Peer<AdapterInternal>, string>([]);

export default defineWebSocketHandler({
  open(peer) {},
  message(peer, message) {},
});
