import Avatar from "boring-avatars";
import {
  DotsThreeVertical,
  Users,
  ArrowLeft,
  Heart,
  Record,
} from "@phosphor-icons/react";
import { COLOR_SCHEMA } from "../../utils/constants";
import MessagesList from "./MessagesList";
import useChatStore from "../../stores/ChatStore";
import { PanelType } from "../../stores/ChatStore";
import GroupInfos from "./GroupInfos";

const MAP_PANELS: Partial<Record<PanelType, React.ReactElement>> = {
  MESSAGES: <MessagesList />,
  GROUP_INFOS: <GroupInfos />,
};

const ChatRoom = () => {
  const { currentRoom, currentMainPanel, setCurrentMainPanel } = useChatStore();

  return (
    <div className="chat__room">
      {currentMainPanel === "MESSAGES" && (
        <div className="top__bar">
          <div className="room__infos">
            <button className="back">
              <ArrowLeft size={20} fill={COLOR_SCHEMA.whity} />
            </button>
            <div className="room">
              <Avatar size={25} name={currentRoom?.name} />
              <span>{currentRoom?.name}</span>
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
            <button type="button">
              <DotsThreeVertical size={20} fill={COLOR_SCHEMA.whity} />
            </button>
          </div>
        </div>
      )}

      {MAP_PANELS[currentMainPanel]}

      {currentMainPanel === "MESSAGES" && (
        <div className="messagery__form"></div>
      )}
    </div>
  );
};

export default ChatRoom;
