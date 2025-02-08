import { useEffect, useState } from "react";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";

export interface BuddyInfoProps {
  id: string;
  displayName: string;
  ip: string;
  os: string;
  browser: string;
  device: string;
  deviceType: string;
  isSelf?: boolean;
}

interface newMessageProps {
  message: string;
  from: BuddyInfoProps;
  dataType?: string;
  data?: {
    name: string;
    type: string;
    base64: string;
  }[];
}

const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<
    {
      type: string;
      message: string;
    }[]
  >([]);
  const [buddy, setBuddy] = useState<BuddyInfoProps[]>([]);

  const [newMessage, setNewMessage] = useState<newMessageProps | null>();

  const [filesLoading, setFilesLoading] = useState<boolean>(false);

  useEffect(() => {
    const clientId =
      localStorage.getItem("clientId") ??
      `client_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("clientId", clientId);

    const displayName =
      localStorage.getItem("displayName") ??
      uniqueNamesGenerator({
        dictionaries: [colors, animals],
        separator: " ",
        style: "capital",
      });

    localStorage.setItem("displayName", displayName);

    let ws: WebSocket;
    let reconnectInterval: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      ws = new WebSocket(
        `${process.env.NODE_ENV === "development" ? "ws" : "wss"}://${
          process.env.NEXT_PUBLIC_WS_DOMAIN
        }/ws`
      );

      setSocket(ws);

      ws.onopen = () => {
        console.log("WebSocket connection opened");
        ws.send(
          JSON.stringify({
            clientId,
            displayName,
          })
        );

        if (reconnectInterval) {
          clearInterval(reconnectInterval);
          reconnectInterval = null;
        }
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received:", data);

        if (data.type === "buddy") {
          setBuddy(
            data.buddy.map(
              (buddy: {
                id: string;
                displayName: string;
                ip: string;
                os: string;
                browser: string;
                device: string;
              }) => ({
                ...buddy,
                isSelf: buddy.id === clientId,
              })
            )
          );
        } else if (data.type === "buddy-joined") {
          setBuddy((prevBuddy) => [
            ...prevBuddy,
            { ...data.buddy, isSelf: data.buddy.id === clientId },
          ]);
          setMessages((prev) => [
            ...prev,
            { type: "info", message: `${data.buddy.id} joined` },
          ]);
        } else if (data.type === "buddy-left") {
          setBuddy((prevBuddy) =>
            prevBuddy.filter((buddy) => buddy.id !== data.buddyId)
          );
          setMessages((prev) => [
            ...prev,
            { type: "info", message: `${data.BuddyId} left` },
          ]);
        } else {
          if (data.message === "loading files") {
            setFilesLoading(true);

            setNewMessage({
              message: data.message,
              from: data.from,
            });

            return;
          }

          console.log("NM", data);
          setMessages((prev) => [
            ...prev,
            {
              type: data.type,
              message: data.message,
            },
          ]);

          if (data.dataType === "files") {
            setNewMessage({
              message: data.message,
              from: data.from,
              dataType: data.dataType,
              data: JSON.parse(data.message.files),
            });
          } else {
            setNewMessage({
              message: data.message,
              from: data.from,
            });
          }
        }

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed");

          if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
              console.log("Attempting to reconnect...");
              connectWebSocket();
            }, 5000);
          }
        };
      };
    };

    connectWebSocket();

    return () => {
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
      }
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = (message: {
    type: string;
    content: string;
    to?: string;
    dataType?: string;
  }) => {
    console.log("JEY", message);

    if (socket && socket.readyState === WebSocket.OPEN) {
      if (buddy.length === 0) {
        socket.send(JSON.stringify(message));
      } else {
        if (message.type === "files") {
          const files = JSON.parse(message.content);
          console.log("Files", files);

          const from = buddy.find(
            (buddy) => buddy.id === localStorage.getItem("clientId")
          );

          console.log("Sending message", { ...message, from });
          socket.send(JSON.stringify({ ...message, from }));
        } else {
          const from = buddy.find(
            (buddy) => buddy.id === localStorage.getItem("clientId")
          );

          console.log("Sending message", { ...message, from });
          socket.send(JSON.stringify({ ...message, from }));
        }
      }
    }
  };

  return {
    messages,
    buddy,
    sendMessage,
    newMessage,
    setNewMessage,
    filesLoading,
    setFilesLoading,
  };
};

export default useWebSocket;