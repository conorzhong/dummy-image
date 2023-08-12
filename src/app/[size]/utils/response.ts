import { getCacheImage } from './cache'
import { Option } from './option'

export const getResponse = async (option: Option) => {
  const image = getCacheImage(option)

  const buffer = await image.toFormat(option.format).toBuffer()

  const headers = new Headers()
  headers.append('content-type', `image/${option.format}`)
  headers.append(
    'content-disposition',
    `inline; filename="${option.width}x${option.height}.dummy-image.${option.format}"`
  )

  return new Response(buffer, { headers })
}