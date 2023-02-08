import { useStore } from './lib/store'
import { count } from './stores/myStore'

export default function Button() {
	const store = useStore(count)

	return <button onClick={() => store.update((val) => val + 1)}>Increment</button>
}
