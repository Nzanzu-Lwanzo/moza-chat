import Avatar from "boring-avatars";
import {
  DotsThreeVertical,
  Users,
  ArrowLeft,
  Heart,
  Record,
  XCircle,
} from "@phosphor-icons/react";
import { COLOR_SCHEMA } from "../../utils/constants";
import MessagesList from "./MessagesList";
import useChatStore from "../../stores/ChatStore";
import { PanelType } from "../../stores/ChatStore";
import RoomInfos from "./RoomInfos";
import { useState } from "react";
import ChatRoomMenuActions from "./ChatRoomMenuActions";
import { useIsUserInCurrentRoom } from "../../hooks/useValidate";
import { useJoinRoom } from "../../hooks/useUsers";
import useAppStore from "../../stores/AppStore";
import Loader from "../CrossApp/Loader";
import MessageForm from "../Form/MessageForm";
import { convert } from "html-to-text";

const MAP_PANELS: Partial<Record<PanelType, React.ReactElement>> = {
  MESSAGES: <MessagesList />,
  GROUP_INFOS: <RoomInfos />,
};

const ChatRoom = () => {
  const {
    currentRoom,
    currentMainPanel,
    setCurrentMainPanel,
    setChatRoomVisibilityOnMobile,
    setCurrentRoom,
  } = useChatStore();
  const [showMenu, setShowMenu] = useState(false);
  const isUserInCurrentRoom = useIsUserInCurrentRoom();
  const auth = useAppStore((state) => state.auth);
  const { isPending: isJoining, mutate: join } = useJoinRoom();

  return (
    <div className="chat__room">
      {currentMainPanel === "MESSAGES" && (
        <div className="top__bar">
          <div className="room__infos">
            <button
              className="back"
              onClick={() => {
                setCurrentRoom(undefined);
                setChatRoomVisibilityOnMobile(false);
              }}
            >
              <ArrowLeft size={20} fill={COLOR_SCHEMA.whity} />
            </button>
            <div className="room">
              <Avatar size={25} name={currentRoom?.name} />
              <span className="room__name">{currentRoom?.name}</span>
            </div>
          </div>
          <div className="actions">
            <button type="button">
              <Heart size={20} fill={COLOR_SCHEMA.whity} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentMainPanel("GROUP_INFOS")}
            >
              <Users size={20} fill={COLOR_SCHEMA.whity} />
            </button>
            <button
              className="dropdown__container"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
            >
              <DotsThreeVertical size={20} fill={COLOR_SCHEMA.whity} />
            </button>

            <div className={`dopdown__menu ${showMenu ? "show" : ""}`}>
              <ChatRoomMenuActions />
            </div>
          </div>
        </div>
      )}

      {MAP_PANELS[currentMainPanel]}

      {currentMainPanel === "MESSAGES" && <MessageForm></MessageForm>}

      {!isUserInCurrentRoom && (
        <div className="join__panel">
          <Avatar size={150} name={currentRoom?.name} />
          <h2> {currentRoom?.name} </h2>
          <p>
            {currentRoom?.description
              ? convert(currentRoom.description)
              : "L'auteur de cette Chat Room n'a fourni aucune description."}
          </p>
          <button
            type="button"
            onClick={() => join({ rid: currentRoom?._id, uid: auth?._id })}
            className="button__orange"
          >
            {isJoining ? <Loader height={20} width={20} /> : "Rejoindre"}
          </button>
          <button
            type="button"
            className="close"
            onClick={() => {
              setChatRoomVisibilityOnMobile(false);
            }}
          >
            <XCircle size={25} fill="#FFF"></XCircle>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
