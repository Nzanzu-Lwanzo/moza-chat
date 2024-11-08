import { PaperPlane } from "@phosphor-icons/react";
import { COLOR_SCHEMA } from "../../utils/constants";
import useAppStore from "../../stores/AppStore";
import { useCallback, useState } from "react";
import { XCircle } from "@phosphor-icons/react";
import { useSocketContext } from "../../contexts/socketContext";
import useChatStore from "../../stores/ChatStore";
import { enqueueSnackbar } from "notistack";
import { UserType } from "../../typings/@types";

const MessageForm = () => {
  const auth = useAppStore((state) => state.auth);
  let [focus, setFocus] = useState(false);
  const [messageText, setMessageText] = useState("");
  const { currentRoom } = useChatStore();

  const { socket } = useSocketContext()!;

  const handleSendMessage = useCallback(() => {
    if (messageText.length == 0) {
      return;
    }
    const message = {
      content: messageText,
      sendee: auth?._id,
      room: currentRoom?._id,
    };

    setFocus(false);

    // Send notifications to these users
    const all_ids = currentRoom?.participants
      ?.map((participant) => (participant as UserType)._id)
      .filter((id) => id !== auth?._id);

    if (socket?.connected) {
      // Emit
      socket?.emit("message", { message, all_ids, room: currentRoom?._id });
      setMessageText("");
    } else {
      enqueueSnackbar("Vous êtes hors ligne !");
    }
  }, [messageText]);

  return (
    <div className={`messagery__form ${focus ? "input__has__focus" : ""}`}>
      <div className="container">
        <textarea
          name="message"
          className="input"
          placeholder={`Vous écrivez en tant que ${auth?.name}`}
          onFocus={() => setFocus(true)}
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
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
