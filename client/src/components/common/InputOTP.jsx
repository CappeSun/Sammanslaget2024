import { OTPInput, OTPInputContext } from 'input-otp'
import { Dot } from 'lucide-react'

import { cn } from '@/lib/util'
import React, { forwardRef } from 'react'

const InputOTP = forwardRef(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      inputMode='numeric'
      containerClassName={cn(
        'flex items-center gap-2 has-[:disabled]:opacity-50',
        containerClassName
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  )
)

InputOTP.displayName = 'InputOTP'

const InputOTPGroup = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
))
InputOTPGroup.displayName = 'InputOTPGroup'

const InputOTPSlot = forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        'border-input text-dark-purple relative flex h-14 w-14 items-center justify-center border-y border-r text-xl transition-all first:rounded-l-xl first:border-l last:rounded-r-xl',
        isActive && 'ring-ring ring-offset-background z-10 ring-2',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='bg-foreground h-4 w-px animate-caret-blink duration-1000' />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = 'InputOTPSlot'

const InputOTPSeparator = forwardRef(({ ...props }, ref) => (
  <div ref={ref} role='separator' {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = 'InputOTPSeparator'

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
