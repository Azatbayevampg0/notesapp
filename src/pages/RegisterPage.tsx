import { LockIcon, UserIcon } from 'lucide-react'
import $axios from '@/server'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authStore } from '@/store/auth.store'
import { useMutation } from '@tanstack/react-query'
import { authSchema, AuthFormValues } from '@/schema/schema'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export const RegisterPage = () => {
	const { setIsAuth, setUser } = authStore()
	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthFormValues>({
		resolver: yupResolver(authSchema),
	})

	const { mutate } = useMutation({
		mutationKey: ['register'],
		mutationFn: async (values: AuthFormValues) => {
			const { data } = await $axios.post('/auth/register', values)

			return data
		},
		onSuccess: data => {
			setIsAuth(true)
			setUser({ username: data.username })
			navigate('/login')
		},
		onError: error => {
			console.log(error)
		},
	})

	const onSubmit = (values: AuthFormValues) => {
		mutate(values)
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4'>
			<Card className='w-full max-w-md bg-white shadow-xl rounded-2xl'>
				<CardHeader className='space-y-2 text-center pb-8'>
					<CardTitle className='text-3xl font-bold text-indigo-600'>
						Create Account
					</CardTitle>
					<p className='text-gray-500'>Sign up to get started</p>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
						<div className='space-y-4'>
							<div className='relative'>
								<Input
									type='text'
									placeholder='Username'
									className='pl-10 h-12 border border-indigo-300 focus:ring-2 focus:ring-indigo-500 rounded-md'
									{...register('username')}
								/>
								<UserIcon className='absolute left-3 top-3.5 h-5 w-5 text-indigo-400' />
								{errors.username && (
									<p className='text-sm text-red-500 mt-1'>
										{errors.username.message}
									</p>
								)}
							</div>
							<div className='relative'>
								<Input
									type='password'
									placeholder='Password'
									className='pl-10 h-12 border border-indigo-300 focus:ring-2 focus:ring-indigo-500 rounded-md'
									{...register('password')}
								/>
								<LockIcon className='absolute left-3 top-3.5 h-5 w-5 text-indigo-400' />
								{errors.password && (
									<p className='text-sm text-red-500 mt-1'>
										{errors.password.message}
									</p>
								)}
							</div>
						</div>

						<div className='text-sm text-center'>
							<span className='text-gray-500'>Already have an account? </span>
							<a href='/login' className='text-indigo-600 hover:underline'>
								Sign in
							</a>
						</div>

						<Button
							type='submit'
							className='w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-md transition'
						>
							Create Account
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
