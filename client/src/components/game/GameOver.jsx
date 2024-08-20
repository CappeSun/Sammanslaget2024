import { useGameContext } from '@/lib/context/GameContext'
import Grid from './Grid'

const GameOver = () => {
  const { game } = useGameContext()

  return (
    <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/30 backdrop-blur-sm'>
      <div className='flex max-w-[500px] flex-col items-center rounded-lg bg-white p-4'>
        <h1>Winner</h1>
        <Grid items={game.items} />
      </div>
    </div>
  )
}

export default GameOver
