import * as React from 'react'
import { ColorResult } from 'react-color'
import { ReactSVG } from 'react-svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef, memo, useMemo, createRef, useLayoutEffect } from 'react'
import { TextCustomization, UseEditorInt } from '@client/shared/validators'
import { Translation, useTranslation } from 'react-i18next'
import Accordion from '@client/components/Accordion/Accordion'
import TextareaExtended from '@client/components/TextareaExpended/TextareaExtended'
import ColorPicker from '@client/components/ColorPicker/ColorPicker'
import InputRangeSlider from '@client/components/InputRangeSlider/InputRangeSlider'
import TextBox from '@client/shared/models/TextBox'
import { fontsFamily, createText } from '@client/shared/config-editor'
import { EditorContext, EditorState } from '@client/store/EditorContext'
import { CUSTOM_TEXT, ADD_TEXT, REMOVE_TEXT, SET_TEXT_ID_SELECTED } from '@client/store/reducer/constants'
import { useEditor } from '@client/shared/hooks'
import { toHistoryType } from '@client/utils/helpers'
import { wait } from '@shared/utils'
import './customization.scss'

function Customization(): JSX.Element {
  const { t } = useTranslation()
  const colorPicker = useRef<any>(null)
  const [{ textIdSelected, texts, drawProperties, memeSelected, saveToEditor }, dispatchEditor]: [
    UseEditorInt,
    Function
  ] = useEditor()

  const textsRef: Array<any> = useMemo(
    () =>
      Array.from({ length: texts.length }).map(() => ({
        textarea: createRef(),
        accordion: createRef(),
        colorPicker: createRef()
      })),
    [texts.length]
  )

  const handleEdit = ({ textId, type, value }: TextCustomization): void => {
    const text: any = { ...texts.find((t: TextBox) => t.id === textId) }
    if (type in text) text[type] = value
    saveToEditor({ type: CUSTOM_TEXT, text, historyType: toHistoryType(type) })
  }

  const addText = (): void => {
    const text = createText({
      centerY: 50,
      centerX: 340,
      height: 100,
      width: 680
    })
    text.height = text.base.height * drawProperties.scale
    text.width = text.base.width * drawProperties.scale
    text.centerY = drawProperties.height / 2
    text.centerX = drawProperties.width / 2
    saveToEditor({ type: ADD_TEXT, text })
    wait(0).then(() =>
      dispatchEditor({
        type: SET_TEXT_ID_SELECTED,
        textIdSelected: text.id
      })
    )
  }

  const removeText = (textId: string): void => {
    const text = texts.find(t => t.id === textId)
    saveToEditor({ type: REMOVE_TEXT, text })
  }

  useLayoutEffect(() => {
    if (textIdSelected) {
      const textIndex = texts.findIndex(text => text.id === textIdSelected)
      for (let index = 0; index < textsRef.length; index++) {
        const accordion: any = textsRef[index].accordion.current
        if (index === textIndex) accordion.open()
        else accordion.close()
      }
    }
  }, [textIdSelected, texts, textsRef])

  return (
    <div className="customization-not-empty">
      <h2>{t('studio.editMeme', { name: memeSelected.name })}</h2>
      {texts.map(
        (
          { value, id, uuid, color, fontSize, alignVertical, textAlign, isUppercase, fontFamily, boxShadow },
          i
        ): React.ReactNode => (
          <Accordion
            defaultOpened={id === textIdSelected}
            ref={textsRef[i].accordion}
            title={value.trim() || `${t('studio.text')} #${i + 1}`}
            key={uuid}
            removeText={(): void => removeText(id)}
            afterImmediateOpening={(): void => {
              if (id !== textIdSelected) {
                dispatchEditor({
                  type: SET_TEXT_ID_SELECTED,
                  textIdSelected: id
                })
              }
            }}
            afterOpening={(): void => {
              const textarea: any = textsRef[i].textarea.current
              textarea.focus()
            }}
          >
            <div className="customization-textbox-section">
              <div className="field-customization">
                <TextareaExtended
                  rows={1}
                  ref={textsRef[i].textarea}
                  placeholder={`${t('studio.text')} #${i + 1}`}
                  value={value}
                  onChange={(value: any): void =>
                    handleEdit({
                      textId: id,
                      type: 'value',
                      value
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="font-size">{t('studio.maxFontSize')}</label>
                <InputRangeSlider
                  id="font-size"
                  max={50}
                  width={98}
                  min={0}
                  step={1}
                  value={fontSize}
                  onChange={(value: number): void =>
                    handleEdit({
                      textId: id,
                      type: 'fontSize',
                      value
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="box-shadow">{t('studio.boxShadow')}</label>
                <InputRangeSlider
                  id="box-shadow"
                  max={10}
                  width={98}
                  min={0}
                  step={1}
                  value={boxShadow}
                  onChange={(value: number): void =>
                    handleEdit({
                      textId: id,
                      type: 'boxShadow',
                      value
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="color" onClick={(): void => colorPicker.current.open()}>
                  {t('studio.color')}
                </label>
                <ColorPicker
                  ref={textsRef[i].colorPicker}
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
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'fontFamily',
                      value: event.target.value
                    })
                  }
                >
                  {fontsFamily.map((font: string) => (
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
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'alignVertical',
                      value: event.target.value
                    })
                  }
                >
                  <option value="top">{t('studio.top')}</option>
                  <option value="middle">{t('studio.middle')}</option>
                  <option value="bottom">{t('studio.bottom')}</option>
                </select>
              </div>
              <div className="field-customization">
                <span>{t('studio.textAlign')}</span>
                <select
                  value={textAlign}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'textAlign',
                      value: event.target.value
                    })
                  }
                >
                  <option value="left">{t('studio.left')}</option>
                  <option value="center">{t('studio.center')}</option>
                  <option value="right">{t('studio.right')}</option>
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
      <button className="add-text-button" onClick={(): void => addText()}>
        <FontAwesomeIcon className="icon-plus" icon={['fas', 'plus']} />
        <span>{t('studio.addText')}</span>
      </button>
    </div>
  )
}

export default memo(
  (props: any): JSX.Element => {
    return (
      <EditorContext.Consumer>
        {([{ memeSelected }]: [EditorState]): JSX.Element => (
          <div className="customization">
            {memeSelected ? (
              <Customization {...props} />
            ) : (
              <div className="customization-empty">
                <ReactSVG src="images/sad.svg" wrapper="span" className="wrapper-sad-svg" />
                <Translation>{(t): any => <h3>{t('studio.noMemeSelected')}</h3>}</Translation>
              </div>
            )}
          </div>
        )}
      </EditorContext.Consumer>
    )
  }
)