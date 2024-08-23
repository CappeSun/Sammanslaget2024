import { useGameContext } from '@/lib/context/GameContext'
import { cn } from '@/lib/util'
import Typography from '../common/Typography'

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

  const emojiMatches = item.match(
    /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?)/gu
  )
  const emojis = emojiMatches ? emojiMatches.join('') : ''
  const text = item
    .replace(
      /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?)/gu,
      ''
    )
    .trim()

  return (
    <Comp
      htmlFor={item.name}
      className={cn(
        'bg-bingo-green relative flex items-center justify-center rounded-lg text-white',
        { 'overflow-hidden': game.user[index] },
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
          className='h-full max-w-full object-cover'
        />
      ) : (
        <div
          className={'overflow-hidden p-2 text-center text-base font-semibold'}
        >
          <Typography className={'font-inter text-lg'}>{emojis}</Typography>
          <Typography className={'font-inter break-words'}>{text}</Typography>
        </div>
      )}
    </Comp>
  )
}

/**
 * Grid
 */

const Grid = ({ className, items, ...props }) => {
  const { game } = useGameContext()

  return (
    <div className='bg-bingo-green/30 mb-4 flex flex-grow flex-col rounded-xl pb-2'>
      <div className='font-outline-2 flex select-none items-center justify-center gap-2 p-2 text-2xl font-black italic text-white'>
        <Typography className={'capitalize'}>
          {Array.isArray(game.users) && game.users[0]
            ? game.users[0]
            : 'Spelare 1'}
        </Typography>
        <Typography className={'text-base font-black'}>vs.</Typography>
        <Typography className={'capitalize'}>
          {Array.isArray(game.users) && game.users[1]
            ? game.users[1]
            : 'Spelare 2'}
        </Typography>
      </div>
      <form
        className={cn(
          'grid flex-grow grid-cols-3 grid-rows-3 gap-2',
          className
        )}
        {...props}
      >
        {items.map((item, index) => (
          <GridItem key={index} index={index} item={item} />
        ))}
      </form>
    </div>
  )
}

export default Grid
