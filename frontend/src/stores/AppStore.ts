import { create } from "zustand";
import { UserType } from "../typings/@types";
import { lsRead } from "../utils/ls.io";

interface SettingsGrant {
  canNotificate: boolean;
  canPlaySoundOnReceipt: boolean;
}

interface State {
  auth?: UserType | undefined;
  modal: "ROOM_FORM" | "PROFILE" | "SETTINGS" | undefined;
  settings: SettingsGrant;
}

interface Actions {
  setAuth(user: State["auth"]): void;
  setModal(modal: State["modal"]): void;
  setSettingsGrant(setting: keyof SettingsGrant, granted: boolean): void;
}

const useAppStore = create<State & Actions>()((set) => ({
  auth: lsRead<UserType>("auth-user"),
  modal: undefined,
  settings: {
    canNotificate: false,
    canPlaySoundOnReceipt: true,
  },
  setAuth(auth) {
    set((state) => {
      return { ...state, auth };
    });
  },
  setModal(modal) {
    set((state) => ({ ...state, modal }));
  },

  setSettingsGrant(setting, granted) {
    set((state) => {
      const settings = state.settings;
      settings[setting] = granted;
      return { ...state, settings };
    });
  },
}));

type ModalType = State["modal"];

export default useAppStore;
export type { ModalType };
