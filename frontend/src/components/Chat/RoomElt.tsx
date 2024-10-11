import { PropsWithChildren } from "react";
import { RoomType } from "../../utils/@types";
import Avatar from "boring-avatars";

const RoomElt = ({ room }: PropsWithChildren<{ room: RoomType}>) => {

  return (
    <>
      {room.picture ? (
        <img
          src={room.picture}
          alt={`Image de profile de la chat room ${room.name}`}
          className="avatar"
        />
      ) : (
        <span>
          <Avatar  name={room.name} height={30}></Avatar>
        </span>
      )}
      <span className="room__name">{room.name}</span>
    </>
  );
};

export default RoomElt;
