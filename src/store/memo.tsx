import create from "zustand";

const useMemoStore = create((set) => ({
  memo: "",
  setMemo: (text) => set({ memo: text }),
  memos: [],
  setMemos: (newMemo) =>
    set((prev) => ({
      memos: [...prev.memos, newMemo],
    })),
}));

export default useMemoStore;
