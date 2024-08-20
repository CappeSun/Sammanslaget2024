import { combinedRef } from '@/lib/hooks/useMultipleRef'
import { mergeReactProps } from '@/lib/util'
import React, { forwardRef } from 'react'

const Slot = forwardRef(({ children, ...props }, ref) => {
  if (!React.isValidElement(children)) return null

  return React.cloneElement(children, {
    ...mergeReactProps(props, children.props),
    ref: combinedRef([ref, children.ref])
  })
})

export default Slot
