import { formatUserName } from "../../utils/formatters";
import { CaretDown } from "@phosphor-icons/react";
import Avatar from "boring-avatars";
import { COLOR_SCHEMA } from "../../utils/constants";

const MessagesList = () => {


  return (
    <div className="messages">
      <ul>
        <li className="not__me">
          <div className="menu__on__message">
            <div className="author">
              <Avatar size={30}></Avatar>
              <span>{formatUserName("John Doe")}</span>
              <span className={`online__status online`}></span>
            </div>
            <button type="button" className="show__menu__on__message">
              <CaretDown size={18} fill={COLOR_SCHEMA.whity} />
            </button>
          </div>
          <div className="message__card">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
            sit a fuga consequuntur provident excepturi totam eius, possimus
            sint repudiandae sed, iusto quae odio, tempore vero quibusdam.
            Illum, rem neque.
          </div>
          <div className="tags">
            <span className="date__tag">12.02.024</span>
            <span className="tag">édité</span>
          </div>
        </li>

        <li className="me">
          <div className="menu__on__message">
            <div className="author">
              <Avatar size={30}></Avatar>
              <span>{formatUserName("John Doe")}</span>
              <span className={`online__status offline`}></span>
            </div>
            <button type="button" className="show__menu__on__message">
              <CaretDown size={18} fill={COLOR_SCHEMA.whity} />
            </button>
          </div>
          <div className="message__card">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
            sit a fuga consequuntur provident excepturi totam eius, possimus
            sint repudiandae sed, iusto quae odio, tempore vero quibusdam.
            Illum, rem neque.
          </div>
          <div className="tags">
            <span className="date__tag">12.02.024</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MessagesList;
