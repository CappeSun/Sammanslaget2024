import Typography from '@/components/common/Typography'
import GameOver from '@/components/game/GameOver'
import Grid from '@/components/game/Grid'
import { useGameContext } from '@/lib/context/GameContext'
import { charCode } from '@/lib/util'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'

const WS_URL = import.meta.env.WS_SERVER_URL ?? 'ws://127.0.0.1:443'

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
    return (
      <section className='flex h-svh flex-col'>
        <div className='flex items-center p-4'>
          <Link to={'/'}>
            <ArrowLeft />
          </Link>
          <Typography className={'w-full pr-4 text-center text-sm uppercase'}>
            Starta nytt spel
          </Typography>
        </div>
        <div className='mb-8 flex flex-col items-center gap-4 pt-16'>
          <Typography className={'text-dark-purple text-4xl font-black'}>
            Dela Pin-Kod
          </Typography>
          <Typography className={'text-dark-purple text-xl'}>
            Dela Pin-Koden med din medspelare
          </Typography>
        </div>
        <div className='border-dark-purple text-dark-purple mx-auto flex w-fit gap-4 rounded-xl border bg-white p-2 text-center text-4xl font-black'>
          {id.split('').map(item => (
            <span>{item}</span>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <Grid items={game.items} />
      {game.isGameOver && <GameOver />}
    </section>
  )
}

export default Game
