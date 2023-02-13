import { writable } from '../lib/store'

export const user = writable({
	name: '',
	email: '',
	isLoggedIn: false,
})
