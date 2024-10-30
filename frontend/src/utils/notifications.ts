import { enqueueSnackbar } from "notistack";
import useAppStore from "../stores/AppStore";
import { MessageType, RoomType } from "../typings/@types";
import Axios, { AxiosError } from "axios";
import { BASE_URL } from "./constants";
import { WEBPUSH_APPLICATION_SERVER_KEY } from "./constants";
import { lsRead } from "./ls.io";

type FnWithResHandlers = {
  onSuccess?: () => void;
  onError?: (e?: AxiosError) => void;
};

export const usePushNotifications = (handlers?: FnWithResHandlers) => {
  const setSettingsGrant = useAppStore((state) => state.setSettingsGrant);

  return () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            setSettingsGrant("canNotificate", true);
            // REGISTER THE SERVICE WORKER
            registerServiceWorker({
              onError: handlers?.onError,
              onSuccess: handlers?.onSuccess,
            });
          }
        })
        .catch(() => null);
    }
  };
};

const onReceiptSound = new Audio("/sounds/on-receipt-notif.mp3");
const onSendSound = new Audio("/sounds/on-send-notif.mp3");

export const useNotificate = () => {
  const { settings } = useAppStore();

  return (message: MessageType, selfissendee: boolean) => {
    const currentRoom = lsRead<RoomType>("current-room");
    if (
      "Notification" in window &&
      Notification.permission === "granted" &&
      !selfissendee
    ) {
      if (currentRoom?._id !== message.room?._id) {
        new Notification(message.room?.name, {
          body: `${message.sendee.name || "Un participant"} dit : ${
            message.content
          }`,
          tag: message.room._id,
        });
      }
    }

    if (settings.canPlaySoundOnReceipt && !selfissendee) {
      onReceiptSound.play().catch(() => null);
    } else if (selfissendee) {
      onSendSound.play().catch(() => null);
    }
  };
};

async function registerServiceWorker({
  onError,
  onSuccess,
}: FnWithResHandlers) {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: WEBPUSH_APPLICATION_SERVER_KEY,
    });

    try {
      const response = await Axios.post(
        BASE_URL.concat("/subscribe-to-push"),
        subscription,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess();
        } else {
          enqueueSnackbar("Vous recevrez désormais les notifications !");
        }
      }
    } catch (e) {
      if (onError && typeof onError == "function") {
        onError(e as AxiosError);
      } else {
        enqueueSnackbar("Erreur de souscription au service notification !");
      }
    }
  } else {
    enqueueSnackbar("Notifications push non supportées !");
  }
}
