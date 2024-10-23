import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { ORIGIN } from "../utils/constants";
import { MessageType } from "../typings/@types";
import useChatStore from "../stores/ChatStore";
import useAppStore from "../stores/AppStore";
import { useNotificate } from "../utils/notifications";

export interface SocketContextType {
  socket: Socket | undefined;
}

const SocketContext = createContext<SocketContextType | null>(null);

const useSocketContext = (): SocketContextType | null => {
  return useContext(SocketContext);
};

const SocketContextProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<SocketContextType["socket"]>();
  const { addMessage, setConnectedUsers } = useChatStore();
  const { auth, setSettingsGrant } = useAppStore();
  const notificate = useNotificate();

  // Socket effect
  useEffect(() => {
    const socket = io(ORIGIN, {
      withCredentials: true,
      autoConnect: true,
      auth: {
        uid: auth?._id,
      },
    });

    setSocket(socket);

    const onMessage = (data: MessageType) => {
      // Save the current message in state
      addMessage(data);
      notificate(data, auth?._id === data.sendee._id);
      console.log(data);
    };

    socket.on("message", onMessage);

    const onConnectedUsers = (connected_users: string[]) => {
      setConnectedUsers(connected_users);
    };

    socket?.on("connected_clients", onConnectedUsers);

    return () => {
      socket.off("message", onMessage);
      socket?.off("connected_clients", onConnectedUsers);
    };
  }, [auth, setSocket]);

  // Notifications effect

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            setSettingsGrant("canNotificate", true);
          }
        })
        .catch(() => null);
    }
  }, []);

  const value: SocketContextType = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export { useSocketContext, SocketContextProvider };
