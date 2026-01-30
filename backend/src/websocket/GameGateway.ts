import { Server as HttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { IPlayer } from "../core/entities/player";
import { ICharacter } from "../core/entities/character";
import { IItem } from "../core/entities/item";

type JoinMessage = {
  type: "join";
  payload: {
    token: string;
    name: string;
    character: ICharacter;
    role: ConnectionRole;
  };
};

type UpdateFieldMessage = {
  type: "update_field";
  payload: {
    playerId: string;
    fieldKey: string;
    delta: number;
  };
};

type AddItemMessage = {
  type: "add_item";
  payload: {
    playerId: string;
    item: IItem;
  };
};

type RemoveItemMessage = {
  type: "remove_item";
  payload: {
    playerId: string;
    itemId: string;
  };
};

type ClientMessage = JoinMessage | UpdateFieldMessage | AddItemMessage | RemoveItemMessage;

/*  */

type GameWebSocket = WebSocket & {
  role?: ConnectionRole;
  playerToken?: string;
};

type ConnectionRole = "admin" | "player" | "spectator";

type GameState = {
  players: IPlayer[];
};

/**
 * Estado em memória (MVP)
 */
const gameState: GameState = {
  players: [],
};

/*  */

export class GameGateway {
  private wss: WebSocketServer;

  constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws: GameWebSocket) => {
      ws.on("message", (raw) => {
        const message = JSON.parse(raw.toString()) as ClientMessage;
        this.handleMessage(ws, message);
      });

      ws.on("close", () => {
        this.handleDisconnect(ws);
      });
    });

    console.log("🧠 WebSocket GameGateway iniciado (TS)");
  }

  private handleMessage(ws: GameWebSocket, message: ClientMessage) {
    switch (message.type) {
      case "join":
        this.handleJoin(message.payload, ws);
        break;

      case "update_field":
        this.handleUpdateField(message.payload, ws);
        break;

      case "add_item":
        this.handleAddItem(message.payload, ws);
        break;

      case "remove_item":
        this.handleRemoveItem(message.payload, ws);
        break;
    }
  }

  private handleDisconnect(ws: GameWebSocket) {
    const token = ws.playerToken;
    if (!token) return;

    const player = gameState.players.find(p => p.token === token);
    if (!player) return;

    player.status = "sleeping";

    this.broadcastState();
  }

  private handleJoin(payload: JoinMessage["payload"], ws: GameWebSocket) {
    const { token, name, character, role } = payload;

    ws.role = role;

    if (role === "player") {
      let player = gameState.players.find(p => p.token === token);

      if (!player) {
        player = {
          token,
          name,
          character,
          status: "online"
        };

        if (player.name !== "Admin") {
          gameState.players.push(player);
        }
      } else {
        player.status = "online";
      }

      ws.playerToken = token;
    }

    this.broadcastState();
  }

  private handleUpdateField(payload: UpdateFieldMessage["payload"], ws: GameWebSocket) {
    if (ws.role !== "admin") return;

    const { playerId, fieldKey, delta } = payload;

    const player = gameState.players.find((p) => p.token === playerId);
    const field = player?.character.fields.find((f) => f.key === fieldKey);

    if (field && typeof field.value === "number") {
      field.value += delta;

      this.broadcastState();
    }
  }

  private handleAddItem({ playerId, item }: AddItemMessage["payload"], ws: GameWebSocket) {
    if (ws.role !== "admin") return;

    const player = gameState.players.find(p => p.token === playerId)
    const field = player?.character.fields.find(f => f.key === "items")

    if (field?.type === "collection") {
      field.value.push(item)

      this.broadcastState()
    }
  }

  private handleRemoveItem({ playerId, itemId }: RemoveItemMessage["payload"], ws: GameWebSocket) {
    if (ws.role !== "admin") return;

    const player = gameState.players.find(p => p.token === playerId)
    const field = player?.character.fields.find(f => f.key === "items")

    if (!field || field.type !== "collection") return;

    const index = field.value.findIndex((i: any) => i.id === itemId)

    if (index === -1) return;

    field.value.splice(index, 1)

    this.broadcastState()
  }

  private broadcastState() {
    const message = JSON.stringify({
      type: "state",
      payload: gameState,
    });

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
