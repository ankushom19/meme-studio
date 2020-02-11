import { randomID } from '@utils/index'

export default class TextBox {
  readonly uuid: string
  public id: string
  public value: string
  public width: number
  public height: number
  public centerX: number
  public centerY: number
  public rotate: number
  public fontSize: number
  public fontFamily: string
  public boxShadow: number
  public color: string
  public alignVertical: string
  public textAlign: string
  public isUppercase: boolean
  readonly base: {
    readonly width: number
    readonly height: number
    readonly centerX: number
    readonly centerY: number
  }

  constructor(text: any) {
    this.uuid = randomID()
    this.id = text.id
    this.value = text.value
    this.width = text.width
    this.height = text.height
    this.centerX = text.centerX
    this.centerY = text.centerY
    this.boxShadow = text.boxShadow
    this.rotate = text.rotate
    this.fontSize = text.fontSize
    this.fontFamily = text.fontFamily
    this.color = text.color
    this.alignVertical = text.alignVertical
    this.textAlign = text.textAlign
    this.isUppercase = text.isUppercase
    this.base = {
      width: this.width,
      height: this.height,
      centerX: this.centerX,
      centerY: this.centerY
    }
  }
}
