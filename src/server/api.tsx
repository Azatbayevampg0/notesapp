// import axios from 'axios'

// const authData = localStorage.getItem('auth-storage')
// const parsed = JSON.parse(authData)
// const { accessToken } = parsed.state

// const instance = axios.create({
// 	baseURL: 'http://185.217.131.96:4949',
// 	timeout: 1000,
// 	headers: { Authorization: `Bearer ${accessToken}` },
// })

// export default instance

import { IAuth } from '@/store/auth.store'
import axios, { AxiosInstance } from 'axios'

interface AuthData {
	state: {
		isAuth: boolean
		accessToken: string
		user: {
			username: string
		}
		setUser: (user: IAuth['user']) => void
		setIsAuth: (bool: boolean) => void
		setAccessToken: (token: string) => void
	}
}

const authData = localStorage.getItem('auth-storage')
let accessToken: string = ''

// If authData is null or invalid, set a default or handle the case
if (authData) {
	try {
		const parsed: AuthData = JSON.parse(authData)
		accessToken = parsed.state?.accessToken || '' // Fallback to an empty string if no token
	} catch (error) {
		console.error('Error parsing auth data:', error)
	}
} else {
	// Set an initial value if no auth data exists
	console.log('No auth data found, using default access token.')
}

const instance: AxiosInstance = axios.create({
	baseURL: 'http://185.217.131.96:4949',
	timeout: 5000, // Timeout set to 5 seconds
	headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
})

export default instance
