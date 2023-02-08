import Button from './Increment'

import { useStore } from './lib/store'
import { time } from './stores/myStore'

function App() {
	const store = useStore(time)

	return (
		<div className="App">
			{store.get()}
			<Button />
		</div>
	)
}

export default App
