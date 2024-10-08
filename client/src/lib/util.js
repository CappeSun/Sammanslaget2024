import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...args) => {
  return twMerge(clsx(args))
}

export const mergeReactProps = (parentProps, childProps) => {
  // All child props should override.
  const overrideProps = { ...childProps }

  for (const propName in childProps) {
    const parentPropValue = parentProps[propName]
    const childPropValue = childProps[propName]

    const isHandler = /^on[A-Z]/.test(propName)
    // If it's a handler, modify the override by composing the base handler.
    if (isHandler) {
      // Only compose the handlers if both exist.
      if (childPropValue && parentPropValue) {
        overrideProps[propName] = (...args) => {
          childPropValue?.(...args)
          parentPropValue?.(...args)
        }
        // Otherwise, avoid creating an unnecessary callback.
      } else if (parentPropValue) {
        overrideProps[propName] = parentPropValue
      }
    } else if (propName === 'style') {
      overrideProps[propName] = { ...parentPropValue, ...childPropValue }
    } else if (propName === 'className') {
      overrideProps[propName] = [parentPropValue, childPropValue]
        .filter(Boolean)
        .join(' ')
    }
  }

  return { ...parentProps, ...overrideProps }
}

export const generateCode = () => {
  let code = ''

  for (let i = 0; i < 4; i++) {
    const ranNum = Math.floor(Math.random() * 10).toString()

    code = code + ranNum
  }

  return code
}

export const charCode = code => {
  return String.fromCharCode(code)
}
