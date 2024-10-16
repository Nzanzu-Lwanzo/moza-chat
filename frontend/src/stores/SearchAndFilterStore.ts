import { create } from "zustand";

export interface State {
  filterSection: "ALL" | "PRIVATE" | "PARTICIPANT" | "MY_ROOMS";
}

interface Actions {
  switchFilterSection(section: State["filterSection"]): void;
}

const useSearchAndFilterStore = create<State & Actions>()((set) => ({
  filterSection: "ALL",
  switchFilterSection(section) {
    set((state) => ({ ...state, filterSection: section }));
  },
}));

export default useSearchAndFilterStore;
