import "../assets/scss/styles/chat.scss";
import ListRooms from "../components/Chat/ListRooms";
import SearchAndFilter from "../components/Chat/SearchAndFilter";
import BottomActions from "../components/Chat/BottomActions";
import Modal from "../components/CrossApp/Modal";

const Chat = () => {
  return (
    <main className="chat__page">
      <div className="chat__card">
        <div className="part">
          <SearchAndFilter />
          <ListRooms />
          <BottomActions />
        </div>

        <div className="part"></div>
      </div>

      <Modal></Modal>
    </main>
  );
};

export default Chat;
