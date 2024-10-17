import { useMutation } from "@tanstack/react-query";
import Axios from "axios";
import { BASE_URL } from "../utils/constants";
import { RoomType } from "../utils/@types";
import useChatStore from "../stores/ChatStore";
import { useTransition } from "react";
import { idbConnection } from "../db/connection";
import { enqueueSnackbar } from "notistack";

export const useQuitRoom = () => {
  const { setCurrentRoom } = useChatStore();

  const { mutate, isPending } = useMutation({
    mutationKey: ["user"],
    mutationFn: async ({
      rid,
      uid,
    }: {
      rid: string | undefined;
      uid: string | undefined;
    }) => {
      if (!rid || !uid) return;

      try {
        const response = await Axios.patch(
          BASE_URL.concat(`/room/${rid}/?action=rmp`),
          [uid],
          { withCredentials: true }
        );

        const data = response.data as RoomType; // Data contains participants list populated

        // Set current room to undefined
        setCurrentRoom(data);
        // Delete user from this room in indexedDB, technically replace the old room with a new one
        idbConnection.insert({
          into: "rooms",
          values: [data],
          upsert: true,
          validation: false,
        });

        enqueueSnackbar("Chat Room quittée avec succès !");
      } catch (e) {
        console.log(e);
        enqueueSnackbar("Erreur de retrait de la Chat Room !");
      }
    },
  });

  return { mutate, isPending };
};

export const useJoinRoom = () => {
  const { setCurrentRoom } = useChatStore();

  const { mutate, isPending } = useMutation({
    mutationKey: ["user"],
    mutationFn: async ({
      rid,
      uid,
    }: {
      rid: string | undefined;
      uid: string | undefined;
    }) => {
      if (!rid || !uid) return;

      try {
        const response = await Axios.patch(
          BASE_URL.concat(`/room/${rid}/?action=adp`),
          [uid],
          { withCredentials: true }
        );

        const data = response.data as RoomType; // Data contains participants list populated

        // Set current room to undefined
        setCurrentRoom(data);

        // Delete user from this room in indexedDB, technically replace the old room with a new one
        idbConnection.insert({
          into: "rooms",
          values: [data],
          upsert: true,
          validation: false,
        });

        enqueueSnackbar("Vous avez rejoint la Chat Room !");
      } catch (e) {
        console.log(e);
        enqueueSnackbar("Erreur de retrait de la Chat Room !");
      }
    },
  });

  return { mutate, isPending };
};
