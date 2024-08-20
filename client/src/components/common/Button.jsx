import { cn } from '@/lib/util'
import { forwardRef } from 'react'
import Slot from '../Slot'

const buttonVariants = {
  variant: {
    default: 'bg-gray-800 text-white hover:bg-gray-700',
    primary: 'bg-blue-600 text-white hover:bg-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-500'
  },
  size: {
    default: 'h-10 px-4 py-2',
    small: 'h-8 px-3 py-1',
    large: 'h-12 px-5 py-3'
  }
}

const Button = forwardRef(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
