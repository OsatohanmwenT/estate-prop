import { create } from "zustand";

interface Owner {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface OwnersStore {
  owners: Owner[];
  setOwners: (owners: Owner[]) => void;
}

export const useOwnersStore = create<OwnersStore>((set) => ({
  owners: [],
  setOwners: (owners) => set({ owners }),
}));
