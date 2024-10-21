import useAppStore from "../../stores/AppStore";
import useChatStore from "../../stores/ChatStore";
import MessageElt from "./MessageElt";
import NoMessage from "./NoMessage";

const MessagesList = () => {
  const messages = useChatStore((state) => state.messages);
  const auth = useAppStore((state) => state.auth);

  return (
    <div className="messages">
      {messages && messages.length !== 0 ? (
        <ul>
          {messages?.map((message) => {
            return (
              <MessageElt
                message={message}
                key={message._id}
                who={message?.sendee?._id === auth?._id ? "me" : "not__me"}
              />
            );
          })}
        </ul>
      ) : (
        <NoMessage></NoMessage>
      )}
    </div>
  );
};

export default MessagesList;
