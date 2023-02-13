import Button from './Increment'

import { useStore } from './lib/store'
import { time as timer, count as counter } from './stores/myStore'

function App() {
	const time = useStore(timer)

	return (
		<div className="App">
			seconds from start: {time}s
			<Button />
		</div>
	)
}

export default App
