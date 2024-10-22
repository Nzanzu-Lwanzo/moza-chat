import GroupChat from "../../assets/illustrations/GroupChat";
import useChatStore from "../../stores/ChatStore";
import useAppStore from "../../stores/AppStore";

const NoChatSelected = () => {
  const rooms = useChatStore((state) => state.rooms);
  const setModal = useAppStore((state) => state.setModal);

  return (
    <div className="no__chat__selected">
      <GroupChat width="300" height="300"></GroupChat>
      <h1 className="app__name">Moza Chat</h1>
      {rooms.length === 0 ? (
        <p>
          Nous n'avons trouvé aucune Chat Room publique ! Créez-en une, vous !
        </p>
      ) : (
        <p>Sélectionnez une Chat Room et lancez-vous dans une conversation !</p>
      )}
      <button
        className="no__data"
        type="button"
        onClick={() => setModal("ROOM_FORM")}
      >
        Initier une Chat Room
      </button>
    </div>
  );
};

export default NoChatSelected;
