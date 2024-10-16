import useAppStore from "../stores/AppStore";
import useChatStore from "../stores/ChatStore";

export const useHasCredentialsOnRoom = (): boolean => {
  const room = useChatStore((state) => state.currentRoom);
  const user = useAppStore((state) => state.auth);

  return room?.initiated_by?._id === user?._id;
};
