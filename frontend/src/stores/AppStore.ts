import { create } from "zustand";
import { UserType } from "../utils/@types";
import { lsRead } from "../utils/ls.io";

interface State {
  auth?: UserType | undefined;
  modal: "ROOM_FORM" | "PROFILE" | undefined;
}

interface Actions {
  setAuth(user: State["auth"]): void;
  setModal(modal: State["modal"]): void;
}

const useAppStore = create<State & Actions>()((set) => ({
  auth: lsRead<UserType>("auth-user"),
  modal: undefined,
  setAuth(auth) {
    set((state) => {
      return { ...state, auth };
    });
  },
  setModal(modal) {
    set((state) => ({ ...state, modal }));
  },
}));

type ModalType = State["modal"];

export default useAppStore;
export type { ModalType };
