import * as React from 'react'
import { TFunctionResult } from 'i18next'
import { ColorResult } from 'react-color'
import { ReactSVG } from 'react-svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { memo, useMemo, createRef, useEffect, useCallback, useContext } from 'react'
import { TextCustomization } from '@client/ts/shared/validators'
import { Translation, useTranslation } from 'react-i18next'
import Accordion from '@client/components/Accordion/Accordion'
import TextareaExtended from '@client/components/TextareaExpended/TextareaExtended'
import ColorPicker from '@client/components/ColorPicker/ColorPicker'
import InputRangeSlider from '@client/components/InputRangeSlider/InputRangeSlider'
import TextBox from '@client/ts/shared/models/TextBox'
import { fontSizeConfig, boxShadowConfig } from '@client/ts/shared/config-editor'
import { EditorContext, EditorState, EditorInt } from '@client/store/EditorContext'
import { CUSTOM_TEXT, ADD_ITEM, REMOVE_ITEM, DUPLICATE_ITEM, SET_ITEM_ID_SELECTED } from '@client/store/reducer/constants'
import { toHistoryType } from '@client/utils/helpers'
import { FONTS_FAMILY, ALIGN_VERTICAL, TEXT_ALIGN } from '@shared/config'
import ImageBox from '@client/ts/shared/models/ImageBox'
import './customization.scss'

function Customization(): JSX.Element {
  const { t } = useTranslation()
  const [{ itemIdSelected, texts, images, memeSelected, saveToEditor }, dispatchEditor]: [EditorInt, Function] = useContext(
    EditorContext
  )

  const textsRefs: Record<string, any> = useMemo(() => {
    const refs: Record<string, any> = {}
    for (const text of texts) {
      refs[text.id] = {
        textarea: createRef<HTMLTextAreaElement>(),
        colorPicker: createRef<any>()
      }
    }
    return refs
  }, [memeSelected.id, texts.length])

  const handleEdit = ({ textId, type, value }: TextCustomization): void => {
    const text: any = { ...texts.find((t: TextBox) => t.id === textId) }
    if (type in text) text[type] = value
    saveToEditor({ type: CUSTOM_TEXT, text, historyType: toHistoryType(type) })
  }

  const addItem = useCallback((): void => {
    saveToEditor({ type: ADD_ITEM, itemType: 'text' })
  }, [saveToEditor])

  const removeItem = useCallback(
    (itemType: 'text' | 'image', itemId: TextBox['id'] | ImageBox['id']): void => {
      saveToEditor({ type: REMOVE_ITEM, itemId, itemType })
    },
    [saveToEditor]
  )

  const duplicateItem = useCallback(
    (itemType: 'text' | 'image', itemId: TextBox['id'] | ImageBox['id']): void => {
      saveToEditor({ type: DUPLICATE_ITEM, itemId, itemType })
    },
    [saveToEditor]
  )

  const selectItem = useCallback(
    (itemId: TextBox['id'] | ImageBox['id'], opened: boolean): void => {
      dispatchEditor({
        type: SET_ITEM_ID_SELECTED,
        itemIdSelected: opened ? itemId : null
      })
    },
    [dispatchEditor]
  )

  useEffect(() => {
    if (itemIdSelected) {
      const item = textsRefs[itemIdSelected]
      const handleKeyPress = (): void => item.textarea.current.focus()
      if (item && item.textarea) {
        window.addEventListener('keypress', handleKeyPress)
        return (): void => {
          window.removeEventListener('keypress', handleKeyPress)
        }
      }
    }
  }, [itemIdSelected, textsRefs])

  console.log(textsRefs)

  return (
    <div className="customization-not-empty">
      <h2>
        {t('studio.customization')} <br /> <span className="meme-name">{memeSelected.name}</span>
      </h2>
      {texts.map(
        (
          { value, id, color, fontSize, alignVertical, textAlign, isUppercase, fontFamily, boxShadow },
          textIndex
        ): React.ReactNode => (
          <Accordion
            id={id}
            type="text"
            defaultOpened={id === itemIdSelected}
            title={value.trim() || `${t('studio.text')} #${textIndex + 1}`}
            key={id}
            onToggle={selectItem}
            onDuplicate={duplicateItem}
            onRemove={removeItem}
          >
            <div className="customization-textbox-section">
              <div className="field-customization">
                <TextareaExtended
                  rows={1}
                  name="value"
                  ref={textsRefs[id].textarea}
                  placeholder={`${t('studio.text')} #${textIndex + 1}`}
                  value={value}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'value',
                      value: event.target.value
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="font-size">{t('studio.maxFontSize')}</label>
                <InputRangeSlider
                  id="font-size"
                  max={fontSizeConfig.max}
                  width={98}
                  min={fontSizeConfig.min}
                  step={1}
                  value={fontSize}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'fontSize',
                      value: parseInt(event.target.value)
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="box-shadow">{t('studio.boxShadow')}</label>
                <InputRangeSlider
                  id="box-shadow"
                  max={boxShadowConfig.max}
                  width={98}
                  min={boxShadowConfig.min}
                  step={1}
                  value={boxShadow}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'boxShadow',
                      value: parseInt(event.target.value)
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="color" onClick={(): void => textsRefs[id].current.open()}>
                  {t('studio.color')}
                </label>
                <ColorPicker
                  ref={textsRefs[id].colorPicker}
                  color={color}
                  setColor={({ hex }: ColorResult): void =>
                    handleEdit({
                      textId: id,
                      type: 'color',
                      value: hex
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <span>{t('studio.fontFamily')}</span>
                <select
                  value={fontFamily}
                  name="font-family"
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'fontFamily',
                      value: event.target.value
                    })
                  }
                >
                  {FONTS_FAMILY.map((font: string) => (
                    <option value={font} key={font.replace(/ /g, '+')}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-customization">
                <span>{t('studio.alignVertical')}</span>
                <select
                  value={alignVertical}
                  name="align-vertical"
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'alignVertical',
                      value: event.target.value
                    })
                  }
                >
                  {ALIGN_VERTICAL.map(value => (
                    <option key={value} value={value}>
                      {t(`studio.${value}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-customization">
                <span>{t('studio.textAlign')}</span>
                <select
                  value={textAlign}
                  name="text-align"
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'textAlign',
                      value: event.target.value
                    })
                  }
                >
                  {TEXT_ALIGN.map(value => (
                    <option key={value} value={value}>
                      {t(`studio.${value}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-customization">
                <span>{t('studio.textUppercase')}</span>
                <input
                  type="checkbox"
                  name="uppercase"
                  checked={isUppercase}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'isUppercase',
                      value: event.target.checked
                    })
                  }
                />
              </div>
            </div>
          </Accordion>
        )
      )}
      {images.map(
        (image: ImageBox, index: number): React.ReactNode => (
          <Accordion
            id={image.id}
            type="image"
            onDuplicate={duplicateItem}
            onRemove={removeItem}
            defaultOpened={image.id === itemIdSelected}
            onToggle={selectItem}
            title={'Image' + index}
            key={image.id}
          >
            <p>Hello</p>
          </Accordion>
        )
      )}
      <button className="add-text-button" onClick={addItem}>
        <FontAwesomeIcon className="icon-plus" icon={['fas', 'plus']} />
        <span>{t('studio.addText')}</span>
      </button>
    </div>
  )
}

export default memo(
  (): JSX.Element => {
    return (
      <EditorContext.Consumer>
        {([{ memeSelected }]: [EditorState]): JSX.Element => (
          <div className="customization">
            {memeSelected ? (
              <Customization />
            ) : (
              <div className="customization-empty">
                <ReactSVG src="/images/sad.svg" wrapper="span" className="wrapper-sad-svg" />
                <Translation>{(t): TFunctionResult => <h3>{t('studio.noMemeSelected')}</h3>}</Translation>
              </div>
            )}
          </div>
        )}
      </EditorContext.Consumer>
    )
  }
)
