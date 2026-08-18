// frontend/src/hooks/useWebSocket.ts
import { useEffect, useState, useRef } from "react";

export const useWebSocket = (url: string, token: string | null) => {
  const [messages, setMessages] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    if (!token) return;

    // Если уже есть открытое или подключающееся соединение – не создаём новое
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    ) {
      console.log("WebSocket already open or connecting, skip");
      return;
    }
    if (isConnectingRef.current) {
      console.log("WebSocket connection already in progress, skip");
      return;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;
    isConnectingRef.current = true;

    ws.onopen = () => {
      // console.log("WebSocket connected, sending auth");
      ws.send(JSON.stringify({ type: "auth", token }));
      isConnectingRef.current = false;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (e) {
        console.error("WebSocket parse error", e);
      }
    };

    ws.onclose = (event) => {
      console.log(
        "WebSocket disconnected, code:",
        event.code,
        "reason:",
        event.reason,
      );
      isConnectingRef.current = false;
    };

    ws.onerror = (error) => {
      console.error("WebSocket error", error);
      isConnectingRef.current = false;
    };

    return () => {
      console.log("Cleaning up WebSocket");
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      isConnectingRef.current = false;
    };
  }, [url, token]);

  const sendMessage = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not open, cannot send message");
    }
  };

  return { messages, sendMessage };
};
