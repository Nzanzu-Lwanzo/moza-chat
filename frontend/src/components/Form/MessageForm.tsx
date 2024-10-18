import { PaperPlane } from "@phosphor-icons/react";
import { COLOR_SCHEMA } from "../../utils/constants";
import useAppStore from "../../stores/AppStore";
import { useCallback, useState } from "react";
import { XCircle } from "@phosphor-icons/react";
import { useSocketContext } from "../../contexts/socketContext";
import useChatStore from "../../stores/ChatStore";

const MessageForm = () => {
  const auth = useAppStore((state) => state.auth);
  let [focus, setFocus] = useState(false);
  const [messageText, setMessageText] = useState("");
  const currentRoom = useChatStore((state) => state.currentRoom);

  const { socket } = useSocketContext()!;

  const handleSendMessage = useCallback(() => {
    const message = {
      content: messageText,
      room: currentRoom?._id,
      sendee: auth?._id,
    };

    socket?.emit("message", message);
  }, []);

  return (
    <div className={`messagery__form ${focus ? "input__has__focus" : ""}`}>
      <div className="container">
        <textarea
          name="message"
          className="input"
          placeholder={`Vous écrivez en tant que ${auth?.name}`}
          onFocus={() => setFocus(true)}
          onChange={(e) => setMessageText(e.target.value)}
        ></textarea>
        <button type="button" className="btn" onClick={handleSendMessage}>
          <PaperPlane fill={COLOR_SCHEMA.secondDark} size={25} />
        </button>
        <button type="button" className="close" onClick={() => setFocus(false)}>
          <XCircle size={25} fill="#FFF"></XCircle>
        </button>
      </div>
    </div>
  );
};

export default MessageForm;
