import GameOver from '@/components/game/GameOver'
import Grid from '@/components/game/Grid'
import { useGameContext } from '@/lib/context/GameContext'
import { useParams } from 'react-router-dom'

const Game = () => {
  const { id } = useParams()
  const { game } = useGameContext()

  return (
    <div>
      <Grid items={game.items} />
      {game.isGameOver && <GameOver />}
    </div>
  )
}

export default Game
