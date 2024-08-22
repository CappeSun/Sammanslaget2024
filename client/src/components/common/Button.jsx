import { cn } from '@/lib/util'
import { forwardRef } from 'react'
import Slot from '../Slot'

const buttonVariants = {
  variant: {
    default:
      'text-dark-purple bg-medium-purple border-2 shadow-button-shadow rounded-full border-dark-purple',
    transparent: 'bg-transparent text-dark-purple border-none'
  }
}

const Button = forwardRef(
  ({ className, variant = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center border px-8 py-3 text-2xl font-bold transition-colors disabled:pointer-events-none disabled:opacity-50',
          buttonVariants.variant[variant],
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
