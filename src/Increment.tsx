import { useStore } from './lib/store'
import { count as counter } from './stores/myStore'
import { useEffect } from 'react'

export default function Button() {
	const [count, update] = useStore(counter)

	useEffect(() => {
		return () => console.log('unmounting')
	}, [])

	return <button onClick={() => update((val) => val + 1)}>Increment</button>
}
