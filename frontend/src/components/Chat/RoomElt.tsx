import { Fragment, PropsWithChildren } from "react";
import { RoomType } from "../../utils/@types";
import Avatar from "boring-avatars";
import { useGetRoom } from "../../hooks/useRooms";
import useChatStore from "../../stores/ChatStore";
import { lsWrite } from "../../utils/ls.io";

const RoomElt = ({ room }: PropsWithChildren<{ room: RoomType }>) => {
  const { currentRoom, setCurrentRoom } = useChatStore();
  let isActive = (id: string) => currentRoom?._id === id;

  const { request } = useGetRoom();

  return (
    <Fragment>
      <li
        className={isActive(room._id) ? "active" : undefined}
        onClick={() => {
          setCurrentRoom(room);
          lsWrite("current-room", room);
          request(room._id);
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
