import React from 'react'

export function useResizeObserverCallback(
  ref: React.RefObject<Element>,
  callback: (dimensions: Dimensions) => void
) {
  React.useEffect(() => {
    const element = ref.current
    const resizeObserver = new ResizeObserver(([event]) => {
      const { inlineSize, blockSize } = event.contentBoxSize[0]
      callback({
        width: inlineSize,
        height: blockSize
      })
    })
    if (element) {
      resizeObserver.observe(element)
      return () => {
        resizeObserver.unobserve(element)
      }
    }
    return () => {}
  }, [ref, callback])
}
