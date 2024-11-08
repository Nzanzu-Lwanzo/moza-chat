import "../assets/scss/styles/chat.scss";
import ListRooms from "../components/Chat/ListRooms";
import SearchAndFilter from "../components/Chat/SearchAndFilter";
import BottomActions from "../components/Chat/BottomActions";
import Modal from "../components/CrossApp/Modal";
import NoChatSelected from "../components/Chat/NoChatSelected";
import ChatRoom from "../components/Chat/ChatRoom";
import useChatStore from "../stores/ChatStore";
import { SocketContextProvider } from "../contexts/socketContext";

const Chat = () => {
  const { currentRoom, chatRoomVisibleOnMobile } = useChatStore();

  return (
    <SocketContextProvider>
      <main className="chat__page">
        <div className="chat__card">
          <div className="part">
            <SearchAndFilter />
            <ListRooms />
            <BottomActions />
          </div>

          <div
            className={`part dark__theme ${
              chatRoomVisibleOnMobile ? "show__on__mobile" : ""
            }`}
          >
            {!currentRoom ? <NoChatSelected></NoChatSelected> : <ChatRoom />}
          </div>
        </div>

        <Modal></Modal>
      </main>
    </SocketContextProvider>
  );
};

export default Chat;
