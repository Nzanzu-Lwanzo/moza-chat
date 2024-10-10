import { create } from "zustand";
import { User } from "../utils/@types";
import { lsRead } from "../utils/ls.io";

interface State {
  auth: User | undefined;
}

interface Actions {
  setAuth(user: User): void;
}

const useAppStore = create<State & Actions>()((set) => ({
  auth: lsRead<User>("auth-user"),
  setAuth(user) {
    set((state) => {
      return { ...state, user };
    });
  },
}));

export default useAppStore;
