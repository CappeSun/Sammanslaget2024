import { useGameContext } from '@/lib/context/GameContext'
import { cn } from '@/lib/util'

/**
 * Grid Item
 */

const GridItem = ({ className, index, item, ...props }) => {
  const { takePicture, game } = useGameContext()

  const Comp = game.isGameOver ? 'div' : 'label'

  const handleFileChange = ev => {
    const { files } = ev.target

    if (files && files.length) takePicture(files[0], index)
  }

  return (
    <Comp
      htmlFor={item.name}
      className={cn(
        'relative flex aspect-square items-center justify-center',
        { 'grid-item-before': index % 3 !== 2 },
        { 'grid-item-after': index < 6 },
        className
      )}
      {...props}
    >
      {!game.isGameOver && (
        <input
          type='file'
          accept='image/*'
          capture='user'
          id={item.name}
          className='hidden'
          multiple={false}
          onChange={handleFileChange}
        />
      )}
      {game.user[index] ? (
        <img
          src={game.user[index].url}
          alt=''
          className='aspect-square max-w-full object-cover'
        />
      ) : (
        item
      )}
    </Comp>
  )
}

/**
 * Grid
 */

const Grid = ({ className, items, ...props }) => {
  const { isGameOver } = useGameContext()

  return (
    <form
      onChange={isGameOver}
      className={cn(
        'grid grid-cols-3 grid-rows-3 border border-black',
        className
      )}
      {...props}
    >
      {items.map((item, index) => (
        <GridItem key={index} index={index} item={item} />
      ))}
    </form>
  )
}

export default Grid
