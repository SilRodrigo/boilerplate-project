import { Server as HttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { gameManager } from "../state/gameManager";
import { tokenService } from "../service/token";
import { setupService } from "../service/setup";
import { bridgeService } from "../service/bridge";
import { GameId } from "../../core/fixtures";

type UpdateMessage = {
  type: "update";
  payload: any;
};

type JoinMessage = {
  type: "join";
  payload: {
    token: string;
    role: ConnectionRole;
  };
};

type UpdateFieldMessage = {
  type: "update_field";
  payload: {
    token: string;
    fieldKey: string;
    delta: number;
  };
};

type AddItemMessage = {
  type: "add_item";
  payload: {
    token: string;
    itemId: string;
  };
};

type RemoveItemMessage = {
  type: "remove_item";
  payload: {
    token: string;
    itemId: string;
  };
};

type KickMessage = {
  type: "kick";
  payload: {
    token: string;
  };
};

type ClientMessage = JoinMessage | UpdateFieldMessage | AddItemMessage | RemoveItemMessage | KickMessage | UpdateMessage;

type GameWebSocket = WebSocket & {
  gameId?: string;
  token?: string;
};

type ConnectionRole = "admin" | "player" | "spectator";

export class GameGateway {
  private wss: WebSocketServer;

  constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws: GameWebSocket) => {
      ws.on("message", (raw) => {
        const message = JSON.parse(raw.toString()) as ClientMessage;
        this.handleMessage(ws, message);
      });

      ws.on("close", () => { });
    });

    setupService.run();

    console.log("🧠 WebSocket GameGateway iniciado (TS)");
  }

  private processMessagePayload(token: string, sessionToken?: string, adminRequired = true)
    : { gameId: string; playerId: string, sessionToken: string } {
    const response = {
      gameId: '',
      playerId: '',
      sessionToken: '',
    }

    try {
      if (!sessionToken) return response;

      const { gameId, playerId } = tokenService.parseToken(token)!;

      if (adminRequired) {
        const { gameId: sessionGameId } = tokenService.parseToken(sessionToken)!;

        if (sessionGameId !== gameId || !gameManager.isAdminToken(gameId, sessionToken)) return response;

        response.sessionToken = sessionToken;
      }

      response.gameId = gameId;
      response.playerId = playerId;

      return response;
    } catch (error) {
      return response;
    }
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

      case "kick":
        this.handleKick(message.payload, ws);
        break;
    }
  }

  private handleJoin({ token }: JoinMessage["payload"], ws: GameWebSocket) {
    if (!token) return;

    const { gameId } = tokenService.parseToken(token)!;

    ws.gameId = gameId;
    ws.token = token;

    this.broadcastState();
  }

  private handleKick({ token }: KickMessage["payload"], ws: GameWebSocket) {
    const { gameId } = this.processMessagePayload(token, ws.token);
    if ((!gameId)) return;

    gameManager.kickPlayer(gameId, token);

    this.broadcastState();
  }

  private handleUpdateField({ token, fieldKey, delta }: UpdateFieldMessage["payload"], ws: GameWebSocket) {
    const { gameId } = this.processMessagePayload(token, ws.token);
    if (!gameId) return;

    const player = gameManager.get(gameId)?.players.find((p) => p.token === token);
    const field = player?.character.fields.find((f) => f.key === fieldKey);

    if (field && typeof field.value === "number") {
      field.value += delta;

      this.broadcastState();
    }
  }

  private async handleAddItem({ token, itemId }: AddItemMessage["payload"], ws: GameWebSocket) {
    const { gameId } = this.processMessagePayload(token, ws.token);
    if (!gameId) return;

    const item = await bridgeService.findItemById({ gameId: gameId as GameId, id: itemId });
    if (!item) return;

    const player = gameManager.get(gameId)?.players.find(p => p.token === token)
    const field = player?.character.fields.find(f => f.key === "items")

    if (field?.type === "collection") {
      field.value.push(item)

      this.broadcastState()
    }
  }

  private handleRemoveItem({ token, itemId }: RemoveItemMessage["payload"], ws: GameWebSocket) {
    const { gameId } = this.processMessagePayload(token, ws.token);
    if (!gameId) return;

    const player = gameManager.get(gameId)?.players.find(p => p.token === token)
    const field = player?.character.fields.find(f => f.key === "items")
    if (!field || field.type !== "collection") return;

    const index = field.value.findIndex((i: any) => i.id === itemId)
    if (index === -1) return;

    field.value.splice(index, 1)

    this.broadcastState()
  }

  private broadcastState() {
    this.wss.clients.forEach((client) => {
      const { gameId } = (client as GameWebSocket);
      if (!gameId) return;

      const message = JSON.stringify({
        type: "state",
        payload: gameManager.get(gameId),
      });

      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
