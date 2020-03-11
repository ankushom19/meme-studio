import TextBox from '@client/shared/models/TextBox'
import { Line } from '@client/shared/validators'
import { API_URL, IS_DEV } from '@shared/config'

export const debug = (text: string, ...args: any[]): void => IS_DEV && console.log(`%c ${text}\n`, 'font-weight: bold', args)

export const getDefaultLang = (availableLangs: Array<string>, defaultLang = 'en'): string =>
  navigator.languages.map(l => l.substr(0, 2)).find(lang => availableLangs.includes(lang)) || defaultLang

export const endWithExt = (exts: Array<string>, filename: string): boolean => exts.some(x => filename.toLowerCase().endsWith(x))

export const innerDimensions = (node: HTMLElement): { height: number; width: number } => {
  const computedStyle: CSSStyleDeclaration = getComputedStyle(node)
  let height: number = node.clientHeight
  let width: number = node.clientWidth
  height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)
  width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
  return { height, width }
}

export const radToDegree = (rad: number): number => (rad * 180) / Math.PI

export const degreeToRad = (degree: number): number => (degree * Math.PI) / 180

export function fillText(
  text: TextBox,
  ctx: CanvasRenderingContext2D,
  maxWidth: number,
  maxHeight: number,
  fontSize: number,
  x: number,
  y: number
): void {
  ctx.save()
  const str = text.value.replace(/\r/g, '')
  const lines: Array<Line> = str.split('\n').map((str: string, index: number, arr: Array<string>) => ({
    x: 0,
    y: 0,
    lineHeight: (): number => {
      if (arr.length > 1) {
        if (index === arr.length - 1) return fontSize
        else return 1.2 * fontSize
      } else {
        return fontSize
      }
    },
    value: text.isUppercase ? str.toUpperCase() : str,
    lineWidth: (): number => ctx.measureText(text.isUppercase ? str.toUpperCase() : str).width
  }))

  const paddingX = 4
  const paddingY = 8

  ctx.fillStyle = text.color || 'black'
  ctx.textBaseline = 'top'
  ctx.strokeStyle = 'black'
  ctx.lineJoin = 'round'
  if (text.boxShadow > 0) ctx.lineWidth = text.boxShadow

  for (const line of lines) {
    ctx.font = `${fontSize}px ${text.fontFamily}`
    while (line.lineWidth() + paddingX * 2 > maxWidth) {
      fontSize--
      ctx.font = `${fontSize}px ${text.fontFamily}`
    }
  }

  const totalHeight = (): number => lines.reduce((accumulator, currentValue) => accumulator + currentValue.lineHeight(), 0)

  while (totalHeight() > maxHeight - paddingY * 2) {
    fontSize--
    ctx.font = `${fontSize}px ${text.fontFamily}`
  }

  ctx.translate(x, y)
  ctx.rotate(degreeToRad(text.rotate))
  ctx.translate(-x, -y)

  for (let index = 0; index < lines.length; index++) {
    const line: Line = lines[index]
    const previousLineHeight = index === 0 ? 0 : lines[index - 1].lineHeight()
    const lineWidth = line.lineWidth()

    if (text.textAlign === 'left') {
      line.x = x - maxWidth / 2 + paddingX
    } else if (text.textAlign === 'center') {
      line.x = x - lineWidth / 2
    } else {
      line.x = x + maxWidth / 2 - lineWidth - paddingX
    }

    if (text.alignVertical === 'top') {
      if (index === 0) line.y = y - maxHeight / 2 + paddingY
      else line.y = lines[index - 1].y + previousLineHeight
    } else if (text.alignVertical === 'middle') {
      if (index === 0) line.y = y - totalHeight() / 2
      else line.y = lines[index - 1].y + previousLineHeight
    } else {
      if (index === 0) line.y = y + maxHeight / 2 - paddingY - totalHeight()
      else line.y = lines[index - 1].y + previousLineHeight
    }

    ctx.fillText(line.value, line.x, line.y)
    ctx.strokeText(line.value, line.x, line.y)
  }
  ctx.restore()
}

export const fetchApi = async (path = '', params = {}): Promise<object> => {
  const url: string = API_URL + path
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...params
  }).then((response: Response) => response.json())
}

export const parseSearchParams = (params: any): string => {
  const searchParams = new URLSearchParams()
  for (const iterator in params) searchParams.append(iterator, params[iterator])
  return searchParams.toString()
}

export const debounce = (func: any, wait: number): any => {
  let timeout: any
  return function(...args: any): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    const later = (): void => {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}