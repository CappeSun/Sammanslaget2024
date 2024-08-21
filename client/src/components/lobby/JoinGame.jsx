import { useState } from 'react'
import CodeForm from './CodeForm'
import NameForm from './NameForm'

const JoinGame = ({}) => {
  const [form, setForm] = useState({})

  const handleSubmit = values => {
    console.log(values)

    setForm(prev => ({ ...prev, ...values }))
  }

  return form.name ? (
    <CodeForm handleSubmit={handleSubmit} />
  ) : (
    <NameForm handleSubmit={handleSubmit} />
  )
}

export default JoinGame
