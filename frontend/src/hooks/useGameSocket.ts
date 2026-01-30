import type { IItem } from "@/data/items";
import { useEffect, useRef, useState } from "react";

/*  remover daqui dps */
type ScalarType = "number" | "string" | "boolean";
type CollectionType = "collection";

interface ScalarField {
    key: string;
    label: string;
    type: ScalarType;
    value: number | string | boolean;
}

interface CollectionField {
    key: string;
    label: string;
    type: CollectionType;
    value: IItem[];
}

type FieldType = ScalarField | CollectionField;

export interface ICharacter {
    id: string;
    name: string;
    image: string;
    quote: string;
    bio: string;
    fields: FieldType[];
}

export interface IPlayer {
  token: string;
  name: string;
  character: ICharacter;
  role: "player" | "admin" | "spectator";
  status?: "online" | "sleeping"
}

type GameState = {
  players: IPlayer[];
};


/*  remover daqui dps */

export function useGameSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const isOpenRef = useRef(false);
  const pendingJoinRef = useRef<any>(null);

  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    if (socketRef.current) return;

    const socket = new WebSocket(import.meta.env.VITE_WS_SERVER_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      isOpenRef.current = true;

      if (pendingJoinRef.current) {
        socket.send(
          JSON.stringify({
            type: "join",
            payload: pendingJoinRef.current,
          })
        );
        pendingJoinRef.current = null;
      }
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "state") {
        setState(message.payload);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    return () => {
      socket.close();
      socketRef.current = null;
      isOpenRef.current = false;
    };
  }, []);

  const join = (playerData: IPlayer) => {
    if (!isOpenRef.current) {
      pendingJoinRef.current = playerData;
      return;
    }

    socketRef.current?.send(
      JSON.stringify({
        type: "join",
        payload: playerData,
      })
    );
  };

  const updateField = (
    playerId: string,
    fieldKey: string,
    delta: number
  ) => {
    if (!isOpenRef.current) return;

    socketRef.current?.send(
      JSON.stringify({
        type: "update_field",
        payload: { playerId, fieldKey, delta },
      })
    );
  };

  const removeItem = (
    playerId: string,
    itemId: string,
  ) => {
    if (!isOpenRef.current) return;

    socketRef.current?.send(
      JSON.stringify({
        type: "remove_item",
        payload: { playerId, itemId },
      })
    );
  };

  const addItem = (
    playerId: string,
    item: IItem,
  ) => {
    if (!isOpenRef.current) return;

    socketRef.current?.send(
      JSON.stringify({
        type: "add_item",
        payload: { playerId, item },
      })
    );
  };

  return { state, join, updateField, removeItem, addItem };
}
