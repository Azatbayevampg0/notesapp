import { Navigate, Outlet } from 'react-router-dom'
import { authStore } from '@/store/auth.store'

export const ProtectedRoute = () => {
	const { isAuth } = authStore()

	return isAuth ? <Outlet /> : <Navigate to='/login' replace />
}
