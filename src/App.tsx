import Button from './Increment'

import { useStore } from './lib/store'
import { time, count } from './stores/myStore'

function App() {
	const store = useStore(count)

	return (
		<div className="App">
			{store.get()}
			<Button />
		</div>
	)
}

export default App
