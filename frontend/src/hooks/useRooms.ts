import useAppStore from "../stores/useAppStore";
import Axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../utils/constants";
import { RoomType } from "../utils/@types";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { idbConnection } from "../db/connection";

export const useGetRooms = () => {
  const { setRooms, auth } = useAppStore();

  const navigateTo = useNavigate();

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      try {
        const response = await Axios.get(BASE_URL.concat("/room/all"), {
          withCredentials: true,
        });

        const rooms = response.data as RoomType[];

        try {
          await idbConnection.insert({
            into: "rooms",
            values: rooms,
            upsert: true,
            skipDataCheck: true,
            ignore: true,
          });
        } catch (e) {
          console.log(e);
        }

        // Take only the rooms that are public
        // and if a room is private, then the initiator must be the currently authenticated user
        const chosenRooms = rooms.filter((room) => {
          return (
            !room.private ||
            (room.private && room.initiated_by?._id === auth?._id)
          );
        });
        setRooms(chosenRooms);

        return chosenRooms;
      } catch (e) {
        let error = e as AxiosError;
        if (error.response?.status === 401) {
          navigateTo("/client/auth/login");
          enqueueSnackbar("Connectez-vous à votre compte !");
          return;
        }

        return e;
      }
    },
  });

  return { data, isFetching, isError, isSuccess };
};

export const useCreateRoom = () => {
  const navigateTo = useNavigate();
  const { setRooms, setModal } = useAppStore();

  const { mutate, data, isPending, isError, isSuccess } = useMutation({
    mutationKey: ["room"],
    mutationFn: async (
      data: Pick<RoomType, "name" | "description" | "private" | "restricted">
    ) => {
      try {
        const response = await Axios.post(BASE_URL.concat("/room/"), data, {
          withCredentials: true,
        });

        if (response.status === 201) {
          let data = response.data as RoomType;

          idbConnection.insert({
            into: "rooms",
            values: [data],
          });

          setRooms([data]);

          setModal(undefined);

          enqueueSnackbar("Chat room créée avec succès !");
        }

        return response.data;
      } catch (e) {
        const errorResponse = (e as AxiosError).response;

        if (errorResponse?.status === 401) {
          navigateTo("/client/auth/login");
          enqueueSnackbar("Connectez-vous pour créer une room !");
        }

        console.log(errorResponse);

        return e;
      }
    },
  });

  return { mutate, data, isPending, isError, isSuccess };
};
