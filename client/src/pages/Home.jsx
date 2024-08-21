import { Button } from '@/components/common/Button'
import Typography from '@/components/common/Typography'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <section className='flex h-screen flex-col justify-between py-4'>
      <Typography variant='h1' className='text-center uppercase'>
        Bingo
      </Typography>
      <div className='flex flex-col gap-4'>
        <Button asChild>
          <Link to={'/game?type=join'}>Gå med</Link>
        </Button>
        <Button asChild>
          <Link to={'/game?type=create'}>Skapa spel</Link>
        </Button>
      </div>
    </section>
  )
}

export default Home
