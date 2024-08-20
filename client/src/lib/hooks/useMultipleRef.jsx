import React from 'react'

/**
 * Handles setting callback refs and MutableRefObjects.
 * @param ref The ref to use for the instance.
 * @param instance The instance being set.
 */
function setRef(ref, instance) {
  if (ref) {
    ref(instance)
  } else if (ref) {
    ref.current = instance
  }
}

export function combinedRef(refs) {
  return instance => refs.forEach(ref => setRef(ref, instance))
}

// CREDIT https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/composeRefs.tsx
/**
 * Create a ref that passes its instance to multiple refs.
 * @param refs The refs that should receive the instance.
 * @returns The combined ref.
 */
export function useMultipleRefs(...refs) {
  return React.useCallback(combinedRef(refs), [refs])
}
