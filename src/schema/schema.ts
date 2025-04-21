import * as yup from 'yup'

export const authSchema = yup.object({
	username: yup.string().required('Username is required'),
	password: yup.string().required('Password is required'),
})


export type AuthFormValues = yup.InferType<typeof authSchema>
