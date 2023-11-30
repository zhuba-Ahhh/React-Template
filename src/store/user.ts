import { create } from 'zustand'

interface UserStore {
  userName: string
  num: number
  changeName: () => void
  changeNum: () => void
}
export const useUserStore = create<UserStore>((set) => ({
  userName: 'Ywj',
  num: 0,
  changeName: () => set({ userName: 'Ywj111' }),
  changeNum: () => set((state) => ({ num: state.num + 1 })),
}))
