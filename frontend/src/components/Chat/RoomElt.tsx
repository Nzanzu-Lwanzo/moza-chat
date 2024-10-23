import { Fragment, PropsWithChildren } from "react";
import { RoomType } from "../../typings/@types";
import Avatar from "boring-avatars";
import { useGetRoom } from "../../hooks/useRooms";
import useChatStore from "../../stores/ChatStore";
import { lsWrite } from "../../utils/ls.io";
import { useSocketContext } from "../../contexts/socketContext";

const RoomElt = ({ room }: PropsWithChildren<{ room: RoomType }>) => {
  const {
    currentRoom,
    setCurrentRoom,
    setChatRoomVisibilityOnMobile,
    setMessages,
  } = useChatStore();
  let isActive = (id: string) => currentRoom?._id === id;
  const { socket } = useSocketContext()!;

  const { request } = useGetRoom();

  return (
    <Fragment>
      <li
        className={isActive(room._id) ? "active" : undefined}
        onClick={() => {
          setMessages([]);
          request(room._id);
          setCurrentRoom(room);
          setChatRoomVisibilityOnMobile(true);
          socket?.emit("join_room", room._id); // Join this room when you select it
          lsWrite("current-room", room);
        }}
      >
        {room.picture ? (
          <img
            src={room.picture}
            alt={`Image de profile de la chat room ${room.name}`}
            className="avatar"
          />
        ) : (
          <span>
            <Avatar name={room.name} height={30}></Avatar>
          </span>
        )}
        <span className="room__name">{room.name}</span>
      </li>
    </Fragment>
  );
};

export default RoomElt;
