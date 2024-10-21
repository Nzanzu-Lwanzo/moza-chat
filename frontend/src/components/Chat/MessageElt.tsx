import { formatDate, formatUserName } from "../../utils/formatters";
import Avatar from "boring-avatars";
import { PaperPlane, PencilCircle, Trash } from "@phosphor-icons/react";
import { COLOR_SCHEMA } from "../../utils/constants";
import { PropsWithChildren, useState } from "react";
import { MessageType } from "../../utils/@types";


interface Props {
  message?: MessageType;
  who?: "me" | "not__me";
}

const MessageElt = ({ message, who }: PropsWithChildren<Props>) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className={who}>
      <div className="menu__on__message">
        <div className="author">
          <Avatar size={30}></Avatar>
          <span>{formatUserName(message?.sendee.name)}</span>
          <span className={`online__status online`}></span>
        </div>

        <button
          type="button"
          className="action__on__message"
        >
          <Trash size={18} fill={COLOR_SCHEMA.whity} />
        </button>

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
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Id illum dicta perspiciatis repudiandae! Corrupti a dolorem repellendus nihil cum! Odio, at tenetur qui temporibus voluptas laudantium libero incidunt sint rem."
        )}
      </div>
      <div className="tags">
        <span className="date__tag">{formatDate(message?.createdAt)}</span>
        <span className="tag">édité</span>
      </div>
    </li>
  );
};

export default MessageElt;
