import { Button } from '@/components/common/Button'
import Typography from '@/components/common/Typography'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <section className='flex h-svh flex-col justify-between'>
      <video
        className='playsinline fixed inset-0 -z-50 h-svh w-screen select-none object-cover'
        playsInline
        muted
        autoPlay
        loop
      >
        <source src='/game.mov' />
      </video>
      <header className='p-4 pt-8 text-white'>
        <Typography
          variant='h1'
          className='font-outline-2 select-none text-center text-6xl font-black uppercase italic'
        >
          Bingo Lens
        </Typography>
        <Typography variant='p' className={'text-center text-2xl font-bold'}>
          Upptäck Lindholmen
        </Typography>
      </header>
      <div className='flex flex-col gap-4 bg-gradient-to-t from-zinc-200/80 to-transparent p-4'>
        <Button asChild>
          <Link to={'/game?type=join'}>Gå med</Link>
        </Button>
        <Button variant={'transparent'} asChild>
          <Link to={'/game?type=create'}>Skapa spel</Link>
        </Button>
      </div>
    </section>
  )
}

export default Home
