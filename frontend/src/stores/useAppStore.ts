import { create } from "zustand";
import { RoomType, UserType } from "../utils/@types";
import { lsRead } from "../utils/ls.io";

interface State {
  auth?: UserType | undefined;
  rooms: RoomType[];
  currentRoom?: RoomType | undefined;
}

interface Actions {
  setAuth(user: State["auth"]): void;
  setRooms(rooms: State["rooms"] | undefined): void;
  setCurrentRoom(room: State["currentRoom"]): void;
}

const useAppStore = create<State & Actions>()((set) => ({
  rooms: [],
  auth: lsRead<UserType>("auth-user"),
  currentRoom: lsRead<RoomType>("current-room"),
  setAuth(user) {
    set((state) => {
      return { ...state, user };
    });
  },
  setRooms(rooms) {
    set((state) => {
      return { ...state, rooms: rooms ? [...rooms, ...state.rooms] : [] };
    });
  },
  setCurrentRoom(room) {
    set((state) => ({ ...state, currentRoom: room }));
  },
}));

export default useAppStore;
