import { create } from "zustand";

const useUserStore = create((set) => ({
    userInfo: { id: 0, name: "", std_id: 0, email: "", verified: "" },
    signedIn: false,
    setUserInfo: (input) => set({ userInfo: input }),
    setSignedIn: (input) => set({ signedIn: input }),
}));

export default useUserStore;
