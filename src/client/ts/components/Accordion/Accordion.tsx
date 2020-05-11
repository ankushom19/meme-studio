import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useRef, useLayoutEffect, useCallback } from 'react'
import './accordion.scss'

const durationAccordion = 600
const cssVar = { '--accordion-duration': durationAccordion + 'ms' } as React.CSSProperties

type AccordionProps = {
  id: string
  type: 'text' | 'image'
  title: string
  defaultOpened: boolean
  children: React.ReactNode
  onToggle: Function
  onRemove?: Function
  onDuplicate?: Function
}

const Accordion = (props: AccordionProps): JSX.Element => {
  const { t } = useTranslation()
  const [currentHeight, setCurrentHeight]: [number, Function] = useState<number>(0)
  const content = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    setCurrentHeight(props.defaultOpened ? content.current.scrollHeight : 0)
  }, [props.defaultOpened, setCurrentHeight])

  const handleRemove = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation()
      props.onRemove && props.onRemove(props.type, props.id)
    },
    [props.onRemove, props.type, props.id]
  )

  const handleDuplicate = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation()
      props.onDuplicate && props.onDuplicate(props.type, props.id)
    },
    [props.onDuplicate, props.type, props.id]
  )

  return (
    <section className={`accordion ${props.defaultOpened ? 'accordion-active' : ''}`} style={cssVar}>
      <div className="accordion-trigger" onClick={(): void => props.onToggle(props.id, !props.defaultOpened)}>
        <p className="accordion-title">{props.title}</p>
        <div>
          {props.onDuplicate && (
            <button
              data-tooltip={t('attr.duplicate')}
              aria-label={t('attr.duplicate')}
              className="accordion-remove-text"
              onClick={handleDuplicate}
            >
              <FontAwesomeIcon icon={['fas', 'clone']} />
            </button>
          )}
          {props.onRemove && (
            <button
              data-tooltip={t('attr.delete')}
              aria-label={t('attr.delete')}
              className="accordion-remove-text"
              onClick={handleRemove}
            >
              <FontAwesomeIcon icon={['fas', 'trash-alt']} />
            </button>
          )}
        </div>
      </div>
      <div className="accordion-content" ref={content} style={{ maxHeight: currentHeight }}>
        {props.children}
      </div>
    </section>
  )
}

export default React.memo(Accordion)
