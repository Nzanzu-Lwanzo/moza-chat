import { create } from "zustand";
import { MessageType, RoomType, UserType } from "../utils/@types";

interface State {
  messages: MessageType[];
  rooms: RoomType[];
  currentRoom?: RoomType | undefined;
  currentMainPanel: "MESSAGES" | "GROUP_INFOS";
  allUsers: UserType[] | null;
  chatRoomVisibleOnMobile: boolean;
}

interface Actions {
  setMessages(messages: State["messages"]): void;
  addMessages(messages: State["messages"]): void;
  setRooms(rooms: State["rooms"] | undefined): void;
  setCurrentRoom(room: State["currentRoom"]): void;
  setRoomsAndReplace(rooms: State["rooms"]): void;
  deleteRoomFromState(id: string): void;
  setCurrentMainPanel(panel: State["currentMainPanel"]): void;
  setAllUsers(users: State["allUsers"]): void;
  setChatRoomVisibilityOnMobile(visible: boolean): void;
  addMessage(message: MessageType): void;
  deleteMessage(id: string): void;
  deleteAuthMessages(id: string | undefined): void;
}

const useChatStore = create<State & Actions>()((set) => ({
  rooms: [],
  currentRoom: undefined, //lsRead<RoomType>("current-room")
  messages: [],
  currentMainPanel: "MESSAGES",
  allUsers: [],
  chatRoomVisibleOnMobile: false,
  setRooms(rooms) {
    set((state) => {
      return { ...state, rooms: rooms ? [...rooms, ...state.rooms] : [] };
    });
  },
  setCurrentRoom(room) {
    set((state) => ({ ...state, currentRoom: room }));
  },
  setRoomsAndReplace(rooms) {
    set((state) => ({ ...state, rooms }));
  },
  setMessages(messages) {
    set((state) => ({ ...state, messages }));
  },
  addMessages(messages) {
    set((state) => ({ ...state, messages: [...state.messages, ...messages] }));
  },
  setCurrentMainPanel(panel) {
    set((state) => ({ ...state, currentMainPanel: panel }));
  },
  setAllUsers(users) {
    set((state) => ({ ...state, allUsers: users }));
  },
  deleteRoomFromState(id) {
    set((state) => {
      return { ...state, rooms: state.rooms.filter((room) => room._id !== id) };
    });
  },
  setChatRoomVisibilityOnMobile(visible) {
    set((state) => ({ ...state, chatRoomVisibleOnMobile: visible }));
  },
  addMessage(message) {
    set((state) => ({ ...state, messages: [...state.messages, message] }));
  },
  deleteMessage(id) {
    set((state) => ({
      ...state,
      messages: state.messages.filter((message) => message._id !== id),
    }));
  },
  deleteAuthMessages(id) {
    set((state) => ({
      ...state,
      messages: id
        ? state.messages.filter((message) => {
            return message.sendee._id !== id;
          })
        : state.messages,
    }));
  },
}));

type PanelType = State["currentMainPanel"];

export default useChatStore;
export type { PanelType };
