import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);
const SocketProvder = ({ children }) => {
  const [socketConnectionState, setSocketConnectionState] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsloading] = useState(true);
  // Socket Connection
  useEffect(() => {
    let socketConnection;

    if (token) {
      // socketConnection = io("https://chatapp-c5fr.onrender.com/",
      socketConnection = io("http://localhost:4001", {
        auth: {
          token: token,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      socketConnection?.on("connect", () => {
        setSocketConnectionState(socketConnection);
        setIsloading(false);
      });
      socketConnection?.on("disconnect", () => {
        setSocketConnectionState(null);
      });
      socketConnection?.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsloading(false);
      });
      return () => {
        if (socketConnection) {
          socketConnection?.disconnect();
        }
      };
    } else {
      setIsloading(false);
    }
  }, [token]);
  return (
    <SocketContext.Provider
      value={{
        socketConnectionState,
        setSocketConnectionState,
        setToken,
        isLoading,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvder };
