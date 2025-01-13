import { useState } from 'react'
import './App.css'
import { CardWithForm } from './components/sign-up'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <CardWithForm />
      </div>
    </div>
    </>
  )
}

export default App
