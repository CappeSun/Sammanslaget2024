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
  const { game, setGame } = useGameContext()
  const ws = useWebSocket(
    `${WS_URL}/${searchParams.get('username') + charCode(0x00)}${searchParams.get('create') ? charCode(0x10) : ''}${id}`,
    {
      share: true,
      shouldReconnect: () => true,
      onMessage: ev => {
        try {
          const type = ev.data.charCodeAt(0)
          const obj = JSON.parse(ev.data.substring(1))

          console.log({ type, obj })

          // 00 Players data
          // 01 Reconect
          // 02 Game start

          if (type === 0) {
            setGame(prev => ({
              ...prev,
              users: obj
            }))
          }

          if (type === 1) {
            const images = obj.player.map((item, index) => {
              const localImage = localStorage.getItem(
                `game_item_${index}_code_${id}_user_${searchParams.get('username')}_image_base64`
              )

              if (localImage) {
                return { url: localImage }
              }

              return item
            })

            setGame(prev => ({
              ...prev,
              isGameStarted: obj.isStarted,
              items: obj.lobby,
              user: images
            }))
          }

          if (type === 2) {
            setGame(prev => ({ ...prev, isGameStarted: true, items: obj }))
          }
        } catch (error) {
          console.log(error)
        }
      }
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
