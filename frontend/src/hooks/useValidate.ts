import useAppStore from "../stores/AppStore";
import useChatStore from "../stores/ChatStore";
import { RoomType, UserType } from "../typings/@types";

export const useHasCredentialsOnRoom = (): boolean => {
  const room = useChatStore((state) => state.currentRoom);
  const auth = useAppStore((state) => state.auth);

  return (
    !room?.restricted ||
    (room.restricted && auth?._id === room.initiated_by?._id)
  );
};

export const useHasRoomAdminCreds = (
  user: UserType,
  room: RoomType
): boolean => {
  return room?.initiated_by?._id === user?._id;
};

export const useIsUserInCurrentRoom = () => {
  const currentRoom = useChatStore((state) => state.currentRoom);
  const auth = useAppStore((state) => state.auth);

  const participants = currentRoom?.participants;

  return (
    participants?.includes(auth?._id) ||
    participants?.some((participant) => {
      return (participant as UserType)._id == auth?._id;
    })
  );
};
