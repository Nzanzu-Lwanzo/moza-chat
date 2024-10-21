import RoomElt from "./RoomElt";
import Placeholder from "../CrossApp/Placeholder";
import NoChat from "../../assets/illustrations/NoChat";
import { useGetRooms, useUpdateRoom } from "../../hooks/useRooms";
import WholeElementLoader from "../CrossApp/WholeElementLoader";
import ServerDown from "../../assets/illustrations/ServerDown";
import { useEffect } from "react";
import useSearchAndFilter from "../../hooks/useSearchAndFilter";
import Loader from "../CrossApp/Loader";
import { COLOR_SCHEMA } from "../../utils/constants";
import useChatStore from "../../stores/ChatStore";

const ListRooms = () => {
  const { isError, isFetching, isSuccess } = useGetRooms();
  const { isUpdatingRoomsAfterUpdateOfARoom } = useUpdateRoom();

  const { rooms, setRooms } = useChatStore();

  const { pending } = useSearchAndFilter();

  useEffect(() => () => setRooms(undefined), []);

  return (
    <div className="list__rooms">
      {pending || isUpdatingRoomsAfterUpdateOfARoom ? (
        <WholeElementLoader
          loader={
            <Loader
              height={100}
              width={100}
              ringColor={COLOR_SCHEMA.whity}
              trackColor={COLOR_SCHEMA.accent}
            />
          }
        />
      ) : isFetching ? (
        <WholeElementLoader />
      ) : isError ? (
        <Placeholder message="Oups ! Une erreur réseau est survenue ! Etes-vous sûr(e) d'être connecté(e) ?">
          <ServerDown />
        </Placeholder>
      ) : isSuccess && rooms.length !== 0 ? (
        <ul>
          {rooms.map((room) => {
            return <RoomElt room={room} key={room._id} />;
          })}
        </ul>
      ) : isSuccess && rooms.length == 0 ? (
        <Placeholder message="Oups ! Aucune room trouvée !">
          <NoChat />
        </Placeholder>
      ) : null}
    </div>
  );
};

export default ListRooms;
