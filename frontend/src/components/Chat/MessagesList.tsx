import { useEffect, useRef } from "react";
import useAppStore from "../../stores/AppStore";
import useChatStore from "../../stores/ChatStore";
import MessageElt from "./MessageElt";
import NoMessage from "./NoMessage";
import { useGetRoom } from "../../hooks/useRooms";
import WholeElementLoader from "../CrossApp/WholeElementLoader";

const MessagesList = () => {
  const messages = useChatStore((state) => state.messages);
  const auth = useAppStore((state) => state.auth);
  const { is_updating_messages_state, status } = useGetRoom();

  const messageBoxRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    messageBoxRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="messages">
      {messages && messages.length !== 0 ? (
        <ul>
          {messages?.map((message) => {
            let who = message?.sendee?._id === auth?._id ? "me" : "not__me";
            return (
              <li key={message._id} className={who} ref={messageBoxRef}>
                <MessageElt
                  message={message}
                  key={message._id}
                  who={message?.sendee?._id === auth?._id ? "me" : "not__me"}
                />
              </li>
            );
          })}
        </ul>
      ) : is_updating_messages_state || status == "pending" ? (
        <WholeElementLoader message="Patientez, nous chargeons les messages de cette room !"></WholeElementLoader>
      ) : (
        <NoMessage></NoMessage>
      )}
    </div>
  );
};

export default MessagesList;
