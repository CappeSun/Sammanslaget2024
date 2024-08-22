import { useState } from 'react'
import CodeForm from './CodeForm'
import NameForm from './NameForm'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Typography from '../common/Typography'

const JoinGame = ({}) => {
  const [form, setForm] = useState({})

  const handleSubmit = values => {
    console.log(values)

    setForm(prev => ({ ...prev, ...values }))
  }

  return (
    <section className='flex h-svh flex-col'>
      <div className='flex items-center p-4'>
        <Link to={'/'}>
          <ArrowLeft />
        </Link>
        <Typography className={'w-full pr-4 text-center text-sm uppercase'}>
          Anslut till spel
        </Typography>
      </div>
      {form.name ? (
        <CodeForm handleSubmit={handleSubmit} />
      ) : (
        <NameForm handleSubmit={handleSubmit} />
      )}
    </section>
  )
}

export default JoinGame
