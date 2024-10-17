import GroupChat from "../../assets/illustrations/GroupChat";
import useChatStore from "../../stores/ChatStore";

const NoChatSelected = () => {
  const rooms = useChatStore((state) => state.rooms);

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
    </div>
  );
};

export default NoChatSelected;
