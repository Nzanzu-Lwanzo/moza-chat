import React, { useEffect, useMemo, useState, useTransition } from "react";
import useAppStore from "../stores/useAppStore";
import { State } from "../stores/useSearchAndFilterStore";
import { idbConnection } from "../db/connection";
import { RoomType } from "../utils/@types";
import { enqueueSnackbar } from "notistack";

const useSearchAndFilter = () => {
  const { setRoomsAndReplace, auth, rooms } = useAppStore();
  const [pending, setTransition] = useTransition();
  const [idbRooms, setIdbRooms] = useState<RoomType[]>([]);

  useEffect(() => {
    idbConnection
      .select({ from: "rooms" })
      .then((data) => setIdbRooms(data as RoomType[]))
      .catch((e) => {
        enqueueSnackbar("Rooms non récupérées pour filtrage !");
        console.log(e);
      });
  }, [rooms]); // Watch for rooms state, in case a new room has just been created

  const forSearchRooms = useMemo(() => {
    return idbRooms.filter((room) => {
      return (
        !room.private || (room.private && room.initiated_by?._id === auth?._id)
      );
    });
  }, [rooms, idbRooms]);

  return {
    search: (e: React.ChangeEvent<HTMLInputElement>) => {
      setTransition(() =>
        setRoomsAndReplace(
          forSearchRooms.filter((room) =>
            room.name.toLowerCase().includes(e.target.value.toLowerCase())
          )
        )
      );
    },

    filter: async (section: State["filterSection"]): Promise<undefined> => {
      switch (section) {
        case "ALL": {
          // Only take the public rooms
          // and those private but whose initiator is the currently authenticated user
          const chosenRooms = idbRooms.filter((room) => {
            return (
              !room.private ||
              (room.private && room.initiated_by?._id === auth?._id)
            );
          });

          setTransition(() => {
            setRoomsAndReplace(chosenRooms);
          });

          break;
        }

        case "PRIVATE": {
          setTransition(() => {
            setRoomsAndReplace(
              idbRooms.filter(
                (room) => room.private && room.initiated_by?._id === auth?._id
              )
            );
          });

          break;
        }

        case "PARTICIPANT": {
          setTransition(() => {
            setRoomsAndReplace(
              idbRooms.filter((room) => room.participants?.includes(auth?._id))
            );
          });

          break;
        }

        case "MY_ROOMS": {
          setTransition(() => {
            setRoomsAndReplace(
              idbRooms.filter((room) => room.initiated_by?._id === auth?._id)
            );
          });
        }
      }

      return;
    },
    pending,
  };
};

export default useSearchAndFilter;
