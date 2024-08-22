import { useNavigate } from 'react-router-dom'
import NameForm from './NameForm'
import { generateCode } from '@/lib/util'

const CreateGame = () => {
  const navigate = useNavigate()

  const handleSubmit = values => {
    console.log(values)
    const code = generateCode()
    navigate(`/game/${code}?username=${values.name}&create=true`)
  }

  return <NameForm handleSubmit={handleSubmit} />
}

export default CreateGame
