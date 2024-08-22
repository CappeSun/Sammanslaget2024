import { createContext, useContext, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

export const GameContext = createContext(null)

const defaultGame = [
  {
    name: 'Båt',
    image: null
  },
  {
    name: 'Fiskmås',
    image: null
  },
  {
    name: 'Karlatornet',
    image: null
  },
  {
    name: 'Visual Arena',
    image: null
  },
  {
    name: 'Kaffe',
    image: null
  },
  {
    name: 'Fish & Chips',
    image: null
  },
  {
    name: 'Cykel',
    image: null
  },
  {
    name: 'Bil',
    image: null
  },
  {
    name: 'Brygga',
    image: null
  }
]

const GameProvider = ({ children }) => {
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [game, setGame] = useState({
    items: [],
    user: [],
    isGameOver: false,
    isGameStarted: false
  })

  const takePicture = (file, index) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      const base64String = reader.result

      // Update the game state
      const newItems = game.user
      newItems[index] = {
        file,
        url: base64String
      }

      // Save the base64 string to localStorage
      localStorage.setItem(
        `game_item_${index}_code_${params.id}_user_${searchParams.get('username')}_image_base64`,
        base64String
      )

      setGame(prev => ({
        ...prev,
        user: newItems
      }))
    }

    reader.readAsDataURL(file)
  }

  const isGameOver = () => {
    const winningCombinations = [
      // Rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonals
      [0, 4, 8],
      [2, 4, 6]
    ]

    const { items } = game

    for (let combination of winningCombinations) {
      const [a, b, c] = combination
      if (items[a].image && items[b].image && items[c].image) {
        setGame(prev => ({ ...prev, isGameOver: true }))
        return
      }
    }
  }

  return (
    <GameContext.Provider value={{ game, takePicture, isGameOver, setGame }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGameContext = () => {
  const context = useContext(GameContext)

  if (!context) {
    throw Error('Unable to use game context outs side of provider')
  }

  return context
}

export default GameProvider
