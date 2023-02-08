import './App.css'
import Button from './Increment'

import { useStore } from './store'
import { time } from './myStore'
import { useState } from 'react'

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
