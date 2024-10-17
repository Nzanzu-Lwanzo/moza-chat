import React, { useEffect, useMemo, useState, useTransition } from "react";
import useAppStore from "../stores/AppStore";
import { State } from "../stores/SearchAndFilterStore";
import { idbConnection } from "../db/connection";
import { RoomType, UserType } from "../utils/@types";
import { enqueueSnackbar } from "notistack";
import useChatStore from "../stores/ChatStore";

const useSearchAndFilter = () => {
  const { auth } = useAppStore();
  const { setRoomsAndReplace, rooms } = useChatStore();
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
  }, [rooms, auth]); // Watch for rooms state, in case a new room has just been created

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
              idbRooms.filter((room) => {
                return (
                  room.participants?.includes(auth?._id) ||
                  room.participants
                    ?.map((user) => {
                      return (user as UserType)._id;
                    })
                    .includes(auth!._id)
                );
              })
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
