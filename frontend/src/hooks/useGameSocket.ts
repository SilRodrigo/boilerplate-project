import type { ICharacter } from "@/data/characters";
import { getPlayerData } from "@/utils/getPlayerData";
import { useEffect, useRef, useState } from "react";

export interface IPlayer {
  token: string;
  name: string;
  character: ICharacter;
}

/*  */

export type GameState = {
  players: IPlayer[];
};

export type PlayerData = {
  token: string;
}

export function useGameSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const isOpenRef = useRef(false);
  const pendingJoinRef = useRef<PlayerData | null>(null);

  const [state, setState] = useState<GameState | null>(null);

  function connect() {
    const socket = new WebSocket(import.meta.env.VITE_WS_SERVER_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      isOpenRef.current = true;

      const playerData = getPlayerData();
      if (playerData) {
        const { token } = playerData;
        join(token);
      }
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "state") {
        setState(message.payload);
      }
    };

    socket.onclose = () => {
      isOpenRef.current = false;
      socketRef.current = null;

      setTimeout(connect, 2000);
    };

    socket.onerror = () => {
      socket.close();
    };
  }

  useEffect(() => {
    connect();

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
      isOpenRef.current = false;
    };
  }, []);

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

    socket.onclose = () => {
      console.log("socket closed");
      isOpenRef.current = false;

      setTimeout(() => {
        socketRef.current = null;
      }, 1000);
    };

    return () => {
      socket.close();
      socketRef.current = null;
      isOpenRef.current = false;
    };
  }, []);

  const send = (data: any) => {
    if (!isOpenRef.current) return;

    socketRef.current?.send(JSON.stringify(data));
  };

  const join = (token: string) => {
    send({ type: "join", payload: { token } });
  };

  const updateField = (token: string, fieldKey: string, delta: number) => {
    send({ type: "update_field", payload: { token, fieldKey, delta } });
  };

  const removeItem = (token: string, itemId: string) => {
    send({ type: "remove_item", payload: { token, itemId } });
  };

  const addItem = (token: string, itemId: string) => {
    send({ type: "add_item", payload: { token, itemId } });
  };

  const kickPlayer = (token: string) => {
    send({ type: "kick", payload: { token } });
  };

  return { state, join, updateField, removeItem, addItem, kickPlayer };
}
