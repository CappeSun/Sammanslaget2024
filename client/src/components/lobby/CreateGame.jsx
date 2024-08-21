import NameForm from './NameForm'

const CreateGame = () => {
  const handleSubmit = values => {
    console.log(values)
  }

  return <NameForm handleSubmit={handleSubmit} />
}

export default CreateGame
