import { type Peer, type AdapterInternal } from "crossws";

const peers = new Map<Peer<AdapterInternal>, string>([]);

export default defineWebSocketHandler({
  open(peer) {},
  message(peer, message) {},
});
