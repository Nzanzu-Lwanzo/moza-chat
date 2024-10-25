import { enqueueSnackbar } from "notistack";
import useAppStore from "../stores/AppStore";
import { MessageType } from "../typings/@types";
import Axios, { AxiosError } from "axios";
import { BASE_URL } from "./constants";
import useChatStore from "../stores/ChatStore";

export const usePushNotifications = () => {
  const setSettingsGrant = useAppStore((state) => state.setSettingsGrant);

  return () => {
    registerServiceWorker();
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            setSettingsGrant("canNotificate", true);
            // REGISTER THE SERVICE WORKER
            registerServiceWorker();
          }
        })
        .catch(() => null);
    }
  };
};

const sound = new Audio("/sounds/on-receipt-notif.mp3");

export const useNotificate = () => {
  const { settings } = useAppStore();
  const currentRoom = useChatStore((state) => state.currentRoom);

  return (message: MessageType, selfissendee: boolean) => {
    if (
      "Notification" in window &&
      Notification.permission === "granted" &&
      !selfissendee
    ) {
      if (
        document.visibilityState === "hidden" ||
        currentRoom?._id !== message.room?._id
      ) {
        new Notification(message.room?.name, {
          body: `${message.sendee.name || "Un participant"} dit : ${
            message.content
          }`,
          tag: message.room._id,
        });
      }
    }

    if (settings.canPlaySoundOnReceipt && !selfissendee) {
      sound.play().catch(() => null);
    }
  };
};

async function registerServiceWorker(onError?: (e: AxiosError) => void) {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: "app-server-key",
    });

    try {
      Axios.post(BASE_URL.concat("/subscribe-to-push"), subscription, {
        withCredentials: true,
      });
    } catch (e) {
      if (onError && typeof onError == "function") onError(e as AxiosError);
      enqueueSnackbar("Erreur de souscription au service notification !");
    }
  } else {
    enqueueSnackbar("Notifications push non supportées !");
  }
}
