import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import Axios from "axios";
import { BASE_URL } from "../utils/constants";
import useChatStore from "../stores/ChatStore";
import { useTransition } from "react";
import useAppStore from "../stores/AppStore";
import { MessageType } from "../typings/@types";

export const useDeleleMessage = () => {
  const removeMessage = useChatStore((state) => state.deleteMessage);
  const [isDeleting, startTransition] = useTransition();
  const { mutate, isPending } = useMutation({
    mutationKey: ["message"],
    mutationFn: async (id: string | undefined) => {
      if (!id) return;

      try {
        const response = await Axios.delete(BASE_URL.concat(`/message/${id}`), {
          withCredentials: true,
        });

        if (response.status < 400) {
          startTransition(() => removeMessage(id));
        }

        return response.data;
      } catch (e) {
        console.log(e);
        enqueueSnackbar("Erreur : message non supprimé !");
      }
    },
  });

  return { isDeleting, mutate, isPending };
};

export const useDeleteMessages = () => {
  const deleteAuthMessages = useChatStore((state) => state.deleteAuthMessages);
  const auth = useAppStore((state) => state.auth);
  const [isDeleting, startTransition] = useTransition();
  const { mutate, isPending } = useMutation({
    mutationKey: ["message"],
    mutationFn: async (id: string | undefined) => {
      if (!id) return;

      try {
        const response = await Axios.delete(
          BASE_URL.concat(`/message/all/${id}`), // The room id
          {
            withCredentials: true,
          }
        );

        if (response.status < 400) {
          startTransition(() => deleteAuthMessages(auth?._id));
        }

        return response.data;
      } catch (e) {
        console.log(e);
        enqueueSnackbar("Erreur : messages non supprimés !");
      }
    },
  });

  return { isDeleting, mutate, isPending };
};

export const useUpdateMessage = (id: string, onSuccess?: () => void) => {
  const updateMessages = useChatStore((state) => state.updateMessages);
  const [updating, startTransition] = useTransition();

  const { mutate, isPending } = useMutation({
    mutationKey: ["message"],
    mutationFn: async (content: string) => {
      if (!id) return;
      try {
        const response = await Axios.patch(
          BASE_URL.concat(`/message/${id}`),
          { content },
          { withCredentials: true }
        );

        if (onSuccess && typeof onSuccess === "function") onSuccess();

        const data = response.data as MessageType;
        startTransition(() => updateMessages(data));

        return data;
      } catch (e) {
        enqueueSnackbar("Erreur : echec de modification !");
      }
    },
  });

  return { updating, mutate, isPending };
};
