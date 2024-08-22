import { Link, useNavigate } from 'react-router-dom'
import NameForm from './NameForm'
import { generateCode } from '@/lib/util'
import { ArrowLeft } from 'lucide-react'
import Typography from '../common/Typography'

const CreateGame = () => {
  const navigate = useNavigate()

  const handleSubmit = values => {
    const code = generateCode()
    navigate(`/game/${code}?username=${values.name}&create=true`)
  }

  return (
    <section className='flex h-svh flex-col'>
      <div className='flex items-center p-4'>
        <Link to={'/'}>
          <ArrowLeft />
        </Link>
        <Typography className={'w-full pr-4 text-center text-sm uppercase'}>
          starta nytt spel
        </Typography>
      </div>
      <NameForm handleSubmit={handleSubmit} />
    </section>
  )
}

export default CreateGame
