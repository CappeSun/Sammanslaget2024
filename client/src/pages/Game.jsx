import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/common/Diolog'
import Typography from '@/components/common/Typography'
import GameOver from '@/components/game/GameOver'
import Grid from '@/components/game/Grid'
import { useGameContext } from '@/lib/context/GameContext'
import { charCode } from '@/lib/util'
import { ArrowLeft, CircleHelp, Loader } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'

const WS_URL = import.meta.env.WS_SERVER_URL ?? 'ws://127.0.0.1:443'

const Game = () => {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { game, setGame } = useGameContext()
  const { sendMessage } = useWebSocket(
    `${WS_URL}/${searchParams.get('username') + charCode(0x7C)}${searchParams.get('create') ? charCode(0x40) : ''}${id}`,
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

  // useEffect(() => {
  //   const username = searchParams.get('username')
  //   console.log('Sending won')
  //   sendMessage(charCode(0x1c) + username)
  // }, [game.isGameOver])

  if (!game.isGameStarted) {
    return (
      <section className='flex h-svh flex-col p-4'>
        <div className='flex items-center pb-4'>
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
        <div className='border-dark-purple text-dark-purple mx-auto flex w-fit items-center justify-center gap-4 rounded-xl border bg-white px-4 py-2 text-center text-4xl font-black'>
          {id.split('').map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
        <div className='text-dark-purple flex flex-grow flex-col items-center justify-center gap-4 pb-16'>
          <Loader size={100} strokeWidth={1.5} className='animate-spin-slow' />
          <Typography className={'text-xl'}>Väntar på medspelare</Typography>
        </div>
      </section>
    )
  }

  return (
    <section className='flex h-svh flex-col p-4'>
      <div className='flex items-center justify-between gap-4 px-4 pb-10'>
        <Link to={'/'}>
          <Typography
            variant='h1'
            className='font-outline-2-medium select-none text-4xl font-black uppercase italic text-white'
          >
            Bingo Lens
          </Typography>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <CircleHelp className='cursor-pointer' />
          </DialogTrigger>
          <DialogContent className='bg-zinc-100'>
            <DialogHeader>
              <DialogTitle>Instruktioner</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-4'>
                <span className='flex h-10 w-10 items-center justify-center rounded-full bg-white p-2 text-base font-black'>
                  1.
                </span>
                <span>Ta dig till platsen som bingobrickan beskriver</span>
              </div>
              <div className='flex items-center gap-4'>
                <span className='flex h-10 w-10 items-center justify-center rounded-full bg-white p-2 text-base font-black'>
                  2.
                </span>
                <span>Klicka på bingobrickan för att ta en bild</span>
              </div>
              <div className='flex items-center gap-4'>
                <span className='flex h-10 w-10 items-center justify-center rounded-full bg-white p-2 text-base font-black'>
                  3.
                </span>
                <span>Först att få tre i rad vinner!</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Grid items={game.items} />
      {game.isGameOver && <GameOver />}
    </section>
  )
}

export default Game
