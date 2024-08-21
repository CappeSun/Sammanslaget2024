import CreateGame from '@/components/lobby/CreateGame'
import JoinGame from '@/components/lobby/JoinGame'
import { Navigate, useSearchParams } from 'react-router-dom'

const Lobby = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get('type')

  if (type !== 'join' && type !== 'create') {
    return <Navigate to={'/'} />
  }

  return type === 'join' ? <JoinGame /> : <CreateGame />
}

export default Lobby
