import { useEffect, useState, useRef } from "react";

export const useWebSocket = (url: string, token: string | null) => {
  const [messages, setMessages] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "auth", token }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "auth_success") {
        } else if (data.type === "auth_failed") {
          console.error("Authentication failed:", data.message);
          ws.close();
        } else {
          setMessages((prev) => [...prev, data]);
        }
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
    };

    ws.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    return () => {
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close();
      }
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
