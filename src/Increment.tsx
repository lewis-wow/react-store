import { useStore } from './store'
import { count } from './myStore'

export default function Button() {
    const store = useStore(count)

    return (
        <button onClick={() => store.update(val => val + 1)}>
            Increment
        </button>
    )
}
