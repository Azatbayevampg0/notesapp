import axios from 'axios'

const $axios = axios.create({
	baseURL: `http://185.217.131.96:4949`,
	timeout: 10000,
})

export default $axios
