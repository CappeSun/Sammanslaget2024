import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'
import Game from '@/pages/Game'
import GameOutlet from './GameOutlet'

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading ...</p>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/game' element={<GameOutlet />}>
            <Route path=':id' element={<Game />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App