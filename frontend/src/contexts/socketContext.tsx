import {
  createContext,
  PropsWithChildren,
  startTransition,
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
  const {
    addMessage,
    setConnectedUsers,
    updateMessages,
    deleteMessage,
    deleteUserMessagesFromRoom,
  } = useChatStore();
  const { auth } = useAppStore();
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
      let selfissendee = auth?._id === data.sendee._id;
      notificate(data, selfissendee);
      // Save the current message in state
      addMessage(data);
    };

    const onUpdateMessage = (data: MessageType) => {
      notificate(data, auth?._id === data.sendee._id);
      // Update the current messages state
      updateMessages(data);
    };

    socket.on("message", onMessage);
    socket.on("update_message", onUpdateMessage);
    socket.on(
      "delete_message",
      ({ message_id }: { message_id: string; room_id: string }) => {
        startTransition(() => deleteMessage(message_id));
      }
    );
    socket.on(
      "delete_messages",
      (data: { uid: string; room_id: string } | undefined | null) => {
        if (data) {
          const { uid, room_id } = data;
          deleteUserMessagesFromRoom(uid, room_id);
        }
      }
    );

    const onConnectedUsers = (connected_users: string[]) => {
      setConnectedUsers(connected_users);
    };

    socket?.on("connected_clients", onConnectedUsers);

    return () => {
      socket?.off("message", onMessage);
      socket?.off("connected_clients", onConnectedUsers);
    };
  }, [auth, setSocket]);

  const value: SocketContextType = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export { useSocketContext, SocketContextProvider };
