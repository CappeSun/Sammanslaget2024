import GameOver from '@/components/game/GameOver'
import Grid from '@/components/game/Grid'
import { useGameContext } from '@/lib/context/GameContext'
import { charCode } from '@/lib/util'
import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'

const WS_URL = import.meta.env.WS_SERVER_URL ?? 'ws://0.0.0.0:444'

const Game = () => {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { game } = useGameContext()
  const ws = useWebSocket(
    `${WS_URL}/${searchParams.get('username') + charCode(0x00)}${searchParams.get('create') ? charCode(0x10) : ''}${id}`,
    {
      share: true,
      shouldReconnect: () => true,
      onMessage: ev => console.log(ev)
    }
  )

  useEffect(() => {
    if (searchParams.get('create')) {
      searchParams.delete('create')
      setSearchParams(searchParams)
    }
  }, [])

  if (!game.isGameStarted) {
    return <section>Lobby</section>
  }

  return (
    <section>
      <Grid items={game.items} />
      {game.isGameOver && <GameOver />}
    </section>
  )
}

export default Game
