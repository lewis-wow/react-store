import Button from './Increment'

import { useStore } from './lib/store'
import { time as timer, count as counter, double } from './stores/myStore'

function App() {
	const count = useStore(double)

	return (
		<div className="App">
			count 2x: {count}
			<Button />
		</div>
	)
}

export default App
