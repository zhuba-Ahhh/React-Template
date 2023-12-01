// https://juejin.cn/post/7232726594208759867
import { create } from 'zustand';

interface CountStore {
  count: number;
  Increment: () => void;
  Decrement: () => void;
}

export const useCountStore = create<CountStore>((set) => ({
  count: 0,
  Increment: () => set((state) => ({ count: state.count + 1 })),
  Decrement: () => set((state) => ({ count: state.count - 1 }))
}));
