import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface IAuth {
	isAuth: boolean
	accessToken: string
	user: {
		username: string
	}
	setUser: (user: IAuth['user']) => void
	setIsAuth: (bool: boolean) => void
	setAccessToken: (token: string) => void
}

export const authStore = create<IAuth>()(
	persist(
		set => ({
			isAuth: false,
			accessToken: '',
			user: {
				username: '',
			},
			setUser: user => set({ user }),
			setIsAuth: bool => set({ isAuth: bool }),
			setAccessToken: token => set({ accessToken: token }),
		}),
		{
			name: 'auth-storage', // localStorage key
			storage: createJSONStorage(() => localStorage), // optional, default: localStorage
		}
	)
)
