import useAppStore from "../stores/useAppStore";
import Axios, { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../utils/constants";
import { RoomType } from "../utils/@types";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

export const useGetRooms = () => {
  const setRooms = useAppStore((state) => state.setRooms);
  const setCurrentRoom = useAppStore((state) => state.setCurrentRoom);

  const navigateTo = useNavigate();

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      try {
        const response = await Axios.get(BASE_URL.concat("/room/all"), {
          withCredentials: true,
        });

        const rooms = response.data as RoomType[];
        setRooms(rooms);
        setCurrentRoom(rooms[0]);

        return rooms;
      } catch (e) {
        let error = e as AxiosError;
        if (error.response?.status === 401) {
          navigateTo("/client/auth/login");
          enqueueSnackbar("Connectez-vous à votre compte !");
          return;
        }

        console.log(e);

        return e;
      }
    },
  });

  return { data, isFetching, isError, isSuccess };
};
