import useAppStore from "../stores/AppStore";
import { MessageType } from "../typings/@types";

export const useRequestNotifGrant = () => {
  const setSettingsGrant = useAppStore((state) => state.setSettingsGrant);

  return () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            setSettingsGrant("canNotificate", true);
          }
        })
        .catch(() => null);
    }
  };
};

export const useNotificate = () => {
  const { settings } = useAppStore();

  return (message: MessageType, selfissendee: boolean) => {
    if (
      "Notification" in window &&
      Notification.permission === "granted" &&
      !selfissendee
    ) {
      new Notification(message.room?.name, {
        body: `${message.sendee.name || "Un participant"} dit : ${
          message.content
        }`,
        tag: message._id,
      });
    }

    if (settings.canPlaySoundOnReceipt) {
      if (selfissendee) {
        const sound = new Audio("/sounds/on-send-notif.mp3");
        sound.play().catch(() => null);
      } else {
        const sound = new Audio("/sounds/on-receipt-notif.mp3");
        sound.play().catch(() => null);
      }
    }
  };
};
