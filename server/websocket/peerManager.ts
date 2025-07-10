import type { GamePeer, WebSocketPeer } from "./types";

const gamePeers = new Map<WebSocketPeer, GamePeer>();

export function addGamePeer(
  peer: WebSocketPeer,
  userData: {
    userId: number;
    username: string;
    avatar: number;
    gameId: string;
    isHost: boolean;
  }
): GamePeer {
  const gamePeer: GamePeer = {
    peer,
    userId: userData.userId,
    username: userData.username,
    avatar: userData.avatar,
    gameId: userData.gameId,
    isHost: userData.isHost,
  };

  gamePeers.set(peer, gamePeer);

  console.log(
    "Player joined game:",
    userData.gameId,
    "user:",
    userData.username,
    "isHost:",
    userData.isHost
  );

  return gamePeer;
}

export function getGamePeer(peer: WebSocketPeer): GamePeer | undefined {
  return gamePeers.get(peer);
}

export function removeGamePeer(peer: WebSocketPeer): GamePeer | undefined {
  const gamePeer = gamePeers.get(peer);
  if (gamePeer) {
    gamePeers.delete(peer);
    console.log(
      "Removed peer:",
      gamePeer.username,
      "from game:",
      gamePeer.gameId
    );
  }
  return gamePeer;
}

export function isPeerConnected(peer: WebSocketPeer): boolean {
  return gamePeers.has(peer);
}
