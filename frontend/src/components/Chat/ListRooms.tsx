import RoomElt from "./RoomElt";
import Placeholder from "../CrossApp/Placeholder";
import NoChat from "../../assets/illustrations/NoChat";
import { useGetRooms } from "../../hooks/useRooms";
import useAppStore from "../../stores/useAppStore";
import WholeElementLoader from "../CrossApp/WholeElementLoader";
import ServerDown from "../../assets/illustrations/ServerDown";
import { lsWrite } from "../../utils/ls.io";
import { useEffect } from "react";

const ListRooms = () => {
  const { isError, isFetching, isSuccess } = useGetRooms();
  const rooms = useAppStore((state) => state.rooms);
  const currentRoom = useAppStore((state) => state.currentRoom);
  const setCurrentRoom = useAppStore((state) => state.setCurrentRoom);
  const setRooms = useAppStore((state) => state.setRooms);

  let isActive = (id: string) => currentRoom?._id === id;

  useEffect(() => () => setRooms(undefined), []);

  return (
    <div className="list__rooms">
      {isFetching ? (
        <WholeElementLoader />
      ) : isError ? (
        <Placeholder message="Oups ! Une erreur réseau est survenue !">
          <ServerDown />
        </Placeholder>
      ) : isSuccess && rooms.length !== 0 ? (
        <ul>
          {rooms.map((room) => {
            return (
              <li
                key={room._id}
                className={isActive(room._id) ? "active" : undefined}
                onClick={() => {
                  setCurrentRoom(room);
                  lsWrite("current-room", room);
                }}
              >
                <RoomElt room={room} />
              </li>
            );
          })}
        </ul>
      ) : isSuccess && rooms.length == 0 ? (
        <Placeholder>
          <NoChat />
        </Placeholder>
      ) : null}
    </div>
  );
};

export default ListRooms;
