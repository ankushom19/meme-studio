import { createRef } from 'react'
import { randomID } from '@utils/index'
import TextBox from './models/TextBox'

export const fontsFamily = [
  'Arial',
  'Helvetica',
  'Impact',
  'Geneva',
  'Arial Black',
  'Times New Roman',
  'Courier New',
  'Lucida Console'
]

export const createText = (base: TextBox['base']): any =>
  new TextBox({
    transform: 0,
    ...base,
    fontSize: 22,
    fontFamily: 'Impact',
    textAlign: 'center',
    alignVertical: 'middle',
    value: '',
    id: randomID(),
    color: '#ffffff',
    isUppercase: false,
    refs: {
      accordion: createRef(),
      textarea: createRef()
    }
  })