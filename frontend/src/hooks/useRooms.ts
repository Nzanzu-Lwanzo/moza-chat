import useAppStore from "../stores/AppStore";
import Axios, { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../utils/constants";
import { RoomType } from "../utils/@types";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { idbConnection } from "../db/connection";
import useChatStore from "../stores/ChatStore";
import { useState, useTransition } from "react";

export const useGetRooms = () => {
  const { auth } = useAppStore();
  const { setRooms } = useChatStore();

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
  const { setModal } = useAppStore();
  const { setRooms } = useChatStore();

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

export const useGetRoom = () => {
  const { setCurrentRoom } = useChatStore();

  const [status, setStatus] = useState<
    "pending" | "error" | "success" | "stable"
  >("stable");

  return {
    request: async (id: RoomType["_id"]) => {
      setStatus("pending");

      Axios.get(BASE_URL.concat(`/room/${id}`), {
        withCredentials: true,
      })
        .then((response) => {
          const data = response.data as RoomType;

          idbConnection.insert({
            into: "rooms",
            values: [data],
            upsert: true,
            ignore: true,
          });

          setCurrentRoom(data);
          setStatus("success");

          return data;
        })
        .catch((e) => {
          setStatus("error");
          let { response } = e as AxiosError;

          if (response?.status === 404) {
            enqueueSnackbar("Chat Room non trouvée sur le serveur !");

            idbConnection.remove({
              from: "rooms",
              where: {
                _id: id,
              },
            });
            return;
          }

          console.log(response);
        });
    },
    status,
  };
};

interface UpdateMutateType {
  rid: RoomType["_id"] | undefined;
  query: "adp" | "rmp" | "gen";
  data: string[] | RoomType;
}

interface HookCallbacksType {
  onSuccess?(data: AxiosResponse["data"]): void;
  onError?(error: AxiosError["response"]): void;
}

export const useUpdateRoom = ({
  onSuccess,
  onError,
}: HookCallbacksType = {}) => {
  const { setCurrentRoom, setRoomsAndReplace } = useChatStore();
  const [isUpdatingRoomsAfterUpdateOfARoom, startTransition] = useTransition();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationKey: ["room"],
    mutationFn: async ({ rid, query, data }: UpdateMutateType) => {
      if (!rid) return enqueueSnackbar("Aucune room n'est séléctionnée !");

      try {
        const response = await Axios.patch(
          BASE_URL.concat(`/room/${rid}/?action=${query}`),
          data,
          { withCredentials: true }
        );

        if (response.status < 400) {
          setCurrentRoom(response.data);

          startTransition(() => {
            idbConnection
              .select({ from: "rooms" })
              .then((data) => {
                const rooms = data as RoomType[];
                let idx = rooms.findIndex(
                  (room) => room._id === response.data?._id
                );

                if (idx == -1) return;

                rooms.splice(idx, 1, response.data);

                setRoomsAndReplace(rooms);
              })
              .catch((e) => {
                console.log(e);
                return;
              });
          });

          idbConnection.insert({
            into: "rooms",
            values: [response.data],
            upsert: true,
            skipDataCheck: true,
          });

          // Do something on success !
          if (onSuccess && typeof onSuccess === "function")
            onSuccess(response.data);
        }
      } catch (e) {
        console.log(e);
        enqueueSnackbar("Echec de la mise-à-jour !");

        // Do something on error !
        if (onError && typeof onError === "function")
          onError((e as AxiosError).response);
      }
    },
  });

  return {
    mutate,
    isPending,
    isError,
    isSuccess,
    isUpdatingRoomsAfterUpdateOfARoom,
  };
};

export const useDeleteRoom = ({
  onSuccess,
  onError,
}: HookCallbacksType = {}) => {
  const { setCurrentRoom, deleteRoomFromState } = useChatStore();

  const { mutate, isPending } = useMutation({
    mutationKey: ["room"],
    mutationFn: async (id: string | undefined) => {
      if (!id)
        return enqueueSnackbar(
          "Aucune Chat Room séléctionnée, actualisez la page !"
        );

      try {
        const response = await Axios.delete(BASE_URL.concat(`/room/${id}`), {
          withCredentials: true,
        });

        if(response.status < 400) {
          enqueueSnackbar("Chat Room supprimée avec succès !");
        }

        let { _id } = response.data as RoomType;

        // Remove room from states
        deleteRoomFromState(_id);

        // Remove the current state
        setCurrentRoom(undefined);

        // Let the user perform an action
        if (onSuccess && typeof onSuccess === "function")
          onSuccess(response.data);

        // Delete from indexDB database
        idbConnection.remove({
          from: "rooms",
          where: { _id: _id },
        });

        // Delete the messages of this room from indexedDB
  

        return response.data;
      } catch (e) {
        console.log(e);
        if (onError && typeof onError === "function")
          onError((e as AxiosError).response);

        enqueueSnackbar("Chat Room non supprimée ! ");
      }
    },
  });

  return { mutate, isPending };
};
