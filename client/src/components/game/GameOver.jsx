import { useGameContext } from '@/lib/context/GameContext'
import Grid from './Grid'
import Typography from '../common/Typography'

const GameOver = () => {
  const { game } = useGameContext()

  return (
    <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/30 backdrop-blur-sm'>
      <div className='flex max-w-[500px] flex-col items-center gap-4 rounded-lg bg-white p-4'>
        <Typography variant='h2' component={'p'}>
          Winner
        </Typography>
        <Grid items={game.items} />
      </div>
    </div>
  )
}

export default GameOver
