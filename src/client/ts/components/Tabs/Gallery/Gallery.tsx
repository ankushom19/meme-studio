import * as React from 'react'
import { memo, useState, useCallback, useRef, RefObject } from 'react'
import Meme from '@client/shared/models/Meme'
import { useMemes } from '@client/shared/hooks'
import { wait } from '@shared/utils'
import './gallery.scss'

type GalleryProps = {
  onSelectMeme: Function
}

function Gallery(props: GalleryProps): JSX.Element {
  const { memes, fetchNextMemes, hasNextMemes } = useMemes()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const scrollerRef: RefObject<HTMLUListElement> = useRef(null)

  const handleScroll = useCallback(async () => {
    const isAtBottom = scrollerRef.current.offsetHeight + scrollerRef.current.scrollTop >= scrollerRef.current.scrollHeight - 150
    if (isAtBottom && !isLoading && hasNextMemes) {
      try {
        setIsLoading(true)
        await wait(200)
        await fetchNextMemes()
      } catch (error) {
        console.warn(error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [fetchNextMemes, isLoading, hasNextMemes])

  return (
    <ul className="gallery" onScroll={handleScroll} ref={scrollerRef}>
      {memes.map(
        (meme: Meme): React.ReactNode => (
          <li key={meme.id} data-id={meme.id} className="gallery-item">
            <img
              loading="lazy"
              width={meme.width}
              height={meme.height}
              onClick={(): void => props.onSelectMeme(meme)}
              src={meme.url}
              alt={meme.name}
            />
          </li>
        )
      )}
    </ul>
  )
}

export default memo(Gallery)