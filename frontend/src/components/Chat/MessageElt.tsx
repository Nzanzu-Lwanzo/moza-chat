import { formatDate, formatUserName } from "../../utils/formatters";
import Avatar from "boring-avatars";
import { PaperPlane, PencilCircle, Trash } from "@phosphor-icons/react";
import { COLOR_SCHEMA } from "../../utils/constants";
import { PropsWithChildren, useState } from "react";
import { MessageType } from "../../typings/@types";
import { useDeleleMessage } from "../../hooks/useMessages";
import Loader from "../CrossApp/Loader";
import useChatStore from "../../stores/ChatStore";
import useAppStore from "../../stores/AppStore";

interface Props {
  message?: MessageType;
  who?: "me" | "not__me";
}

const MessageElt = ({ message, who }: PropsWithChildren<Props>) => {
  const [isEditing, setIsEditing] = useState(false);
  const { isDeleting, isPending, mutate } = useDeleleMessage();
  const { connectedUsers, currentRoom } = useChatStore();
  const auth = useAppStore((state) => state.auth);

  return (
    <>
      <div className="menu__on__message">
        <div className="author">
          <Avatar size={30}></Avatar>
          <span>{formatUserName(message?.sendee?.name)}</span>
          <span
            className={`online__status ${
              connectedUsers.includes(message?.sendee._id!)
                ? "online"
                : "offline"
            }`}
          ></span>
        </div>

        {(who === "me" || currentRoom?.initiated_by?._id == auth?._id) && (
          <>
            <button
              type="button"
              className="action__on__message"
              onClick={() => mutate(message?._id)}
            >
              {isDeleting || isPending ? (
                <Loader height={15} width={15} />
              ) : (
                <Trash size={18} fill={COLOR_SCHEMA.whity} />
              )}
            </button>
          </>
        )}

        {who === "me" && (
          <>
            {isEditing ? (
              <button
                type="button"
                className="action__on__message"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                <PaperPlane size={18} fill={COLOR_SCHEMA.whity} />
              </button>
            ) : (
              <button
                type="button"
                className="action__on__message"
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <PencilCircle size={18} fill={COLOR_SCHEMA.whity} />
              </button>
            )}
          </>
        )}
      </div>
      <div className="message__card">
        {isEditing ? (
          <textarea
            name=""
            id=""
            className="update__message__content"
            defaultValue={message?.content}
          ></textarea>
        ) : (
          message?.content
        )}
      </div>
      <div className="tags">
        <span className="date__tag">
          {formatDate(message?.createdAt, true)}
        </span>
        {/* <span className="tag">édité</span> */}
      </div>
    </>
  );
};

export default MessageElt;
