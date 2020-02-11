import Meme from '@shared/models/Meme'
import { fetchApi, parseSearchParams } from '@utils/index'
import TextBox from '@shared/models/TextBox'

export const API_URL = 'https://meme-studio.herokuapp.com'

const useImgflip = true

/**
 * getMemes
 * @params object - fetch params
 * @return Promise<GetMemesInt> - Pagination of memes
 */

export interface GetMemesInt {
  memes: Array<Meme>
  cursor: {
    before: string | null
    after: string | null
  }
}

export const getMemes = (query: object, params?: object): Promise<GetMemesInt> => {
  if (useImgflip) {
    return fetch('https://api.imgflip.com/get_memes')
      .then(response => response.json())
      .then((response: any) => ({
        memes: response.data.memes.map((item: object) => new Meme(item)),
        cursor: {
          after: null,
          before: null
        }
      }))
  } else {
    return fetchApi(`/memes?${parseSearchParams(query)}`, params).then(({ response }: any) => ({
      memes: response.items.map((item: object) => new Meme(item)),
      cursor: response.cursor
    }))
  }
}
export interface GetMemeInt {
  meme: Meme
  texts: Array<TextBox>
}

export const getMeme = (id: string, params?: object): Promise<GetMemeInt> =>
  fetchApi(`/memes/${id}`, params).then(({ response }: any) => ({
    texts: response.TextBoxes.map((text: any) => new TextBox(text)),
    meme: { ...response }
  }))
