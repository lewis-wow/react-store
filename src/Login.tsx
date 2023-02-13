import { useState } from 'react'
import { useStore } from './lib/store'
import { user as userStore } from './stores/user'

export default function Login() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')

	const [user, setUser] = useStore(userStore)

	if (user.isLoggedIn)
		return (
			<div>
				<h1>Logged in as {user.name}</h1>
				<button onClick={() => setUser((currentUser) => ({ ...currentUser, isLoggedIn: false }))}>
					Logout
				</button>
			</div>
		)

	return (
		<div>
			<h1>Login</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					setUser({ name, email, isLoggedIn: true })
				}}
			>
				<input type="text" value={name} onChange={(e) => setName(e.target.value)} />
				<input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />

				<button type="submit">Submit</button>
			</form>
		</div>
	)
}
