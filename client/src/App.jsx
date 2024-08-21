import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'
import Game from '@/pages/Game'
import GameOutlet from './GameOutlet'
import MainLayout from './components/layout/MainLayout'
import Lobby from './pages/Lobby'

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading ...</p>}>
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='game' element={<GameOutlet />}>
              <Route index element={<Lobby />} />
              <Route path=':id' element={<Game />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
