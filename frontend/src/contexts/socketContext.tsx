import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { ORIGIN } from "../utils/constants";

export interface SocketContextType {
  socket: Socket | undefined;
}

const SocketContext = createContext<SocketContextType | null>(null);

const useSocketContext = (): SocketContextType | null => {
  return useContext(SocketContext);
};

const SocketContextProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<SocketContextType["socket"]>();

  useEffect(() => {
    const socket = io(ORIGIN, {
      withCredentials: true,
      autoConnect: true,
    });

    setSocket(socket);
  }, []);

  const value: SocketContextType = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export { useSocketContext, SocketContextProvider };
