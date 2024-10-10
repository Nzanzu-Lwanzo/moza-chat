import useAppStore from "../stores/useAppStore";


const Chat = () => {

  const auth = useAppStore((state)=>state.auth);
  console.log(auth)
  return <div>Chat</div>;
};

export default Chat;
