import { createContext, useContext, useState } from 'react'

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
  const [game, setGame] = useState({
    items: defaultGame,
    isGameOver: false,
    isGameStarted: false
  })

  const takePicture = (file, index) => {
    const newItems = game.items
    newItems[index].image = {
      file,
      url: URL.createObjectURL(file)
    }

    setGame(prev => ({
      ...prev,
      items: newItems
    }))
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
