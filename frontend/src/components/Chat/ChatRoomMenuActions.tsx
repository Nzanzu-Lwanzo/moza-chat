import { useDeleteMessages } from "../../hooks/useMessages";
import { useDeleteRoom } from "../../hooks/useRooms";
import { useQuitRoom } from "../../hooks/useUsers";
import { useHasRoomAdminCreds } from "../../hooks/useValidate";
import useAppStore from "../../stores/AppStore";
import useChatStore from "../../stores/ChatStore";
import Loader from "../CrossApp/Loader";

const ChatRoomMenuActions = () => {
  const { auth } = useAppStore();
  const { currentRoom, setCurrentMainPanel } = useChatStore();
  const hasAdminCreds = useHasRoomAdminCreds(auth!, currentRoom!);
  const { mutate: deleteRoom, isPending: isDeletingRoom } = useDeleteRoom({
    onSuccess() {
      setCurrentMainPanel("MESSAGES");
    },
  });
  const { mutate: quitRoom, isPending: isQuittingRoom } = useQuitRoom();

  const {
    isDeleting: isDeletingMessages,
    isPending,
    mutate,
  } = useDeleteMessages();

  return (
    <>
      {!hasAdminCreds && (
        <button
          type="button"
          className=""
          onClick={() => quitRoom({ rid: currentRoom?._id, uid: auth?._id })}
        >
          {isQuittingRoom ? (
            <Loader height={15} width={15}></Loader>
          ) : (
            "Quitter la Room"
          )}
        </button>
      )}
      <button
        type="button"
        className=""
        onClick={() => mutate(currentRoom?._id)}
      >
        {isDeletingMessages || isPending ? (
          <Loader height={15} width={15}></Loader>
        ) : (
          "Supprimer mes messages"
        )}
      </button>

      {hasAdminCreds && (
        <button
          type="button"
          className=""
          onClick={() => deleteRoom(currentRoom?._id)}
        >
          {isDeletingRoom ? (
            <Loader height={15} width={15}></Loader>
          ) : (
            " Supprimer le groupe"
          )}
        </button>
      )}
    </>
  );
};

export default ChatRoomMenuActions;
