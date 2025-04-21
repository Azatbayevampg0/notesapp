import { Route, Routes } from 'react-router-dom'
import { NotesPage } from './pages/NotesPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
	return (
		<Routes>
			{/* <Route path='/' element={<Nimadir />} /> */}
			<Route path='/login' element={<LoginPage />} />
			<Route path='/register' element={<RegisterPage />} />

			<Route element={<ProtectedRoute />}>
				<Route path='/' element={<NotesPage />} />
			</Route>
		</Routes>
	)
}

export default App
