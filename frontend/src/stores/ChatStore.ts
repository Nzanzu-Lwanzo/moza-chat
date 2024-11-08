import { create } from "zustand";
import { MessageType, RoomType, UserType } from "../typings/@types";

interface State {
  messages: MessageType[];
  rooms: RoomType[];
  currentRoom?: RoomType | undefined;
  currentMainPanel: "MESSAGES" | "GROUP_INFOS";
  allUsers: UserType[] | null;
  chatRoomVisibleOnMobile: boolean;
  connectedUsers: string[];
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
  updateMessages(message: MessageType): void;
  setConnectedUsers(users: string[]): void;
  deleteUserMessagesFromRoom(uid: string, rid: string): void;
}

const useChatStore = create<State & Actions>()((set) => ({
  rooms: [],
  currentRoom: undefined, //lsRead<RoomType>("current-room")
  messages: [],
  currentMainPanel: "MESSAGES",
  allUsers: [],

  chatRoomVisibleOnMobile: false,
  connectedUsers: [],
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
    // Add message to state if the belongs to the current room
    set((state) => {
      if (state.currentRoom?._id === message.room._id) {
        return { ...state, messages: [...state.messages, message] };
      } else {
        return state;
      }
    });
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
  updateMessages(message) {
    set((state) => {
      const messages = state.messages;
      let idx = messages.findIndex((msg) => msg._id === message._id);
      messages.splice(idx, 1, message);

      return { ...state, messages };
    });
  },
  setConnectedUsers(users) {
    set((state) => ({ ...state, connectedUsers: users }));
  },
  deleteUserMessagesFromRoom(uid) {
    set((state) => {
      return {
        ...state,
        messages: state.messages.filter(
          (message) => message.sendee._id !== uid
        ),
      };
    });
  },
}));

type PanelType = State["currentMainPanel"];

export default useChatStore;
export type { PanelType };
