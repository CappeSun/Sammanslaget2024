import { Outlet } from 'react-router-dom'
import GameProvider from './lib/context/GameContext'

const GameOutlet = () => {
  return (
    <GameProvider>
      <Outlet />
    </GameProvider>
  )
}

export default GameOutlet
