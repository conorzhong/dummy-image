import { NextRequest } from 'next/server'
import sharp from 'sharp'

export type Slug = string[]

/**
 * https://sharp.pixelplumbing.com/api-output#toformat
 * https://www.iana.org/assignments/media-types/media-types.xhtml
 */
export type Format = keyof sharp.FormatEnum | sharp.AvailableFormatInfo
const SUPPORT_FORMAT_LIST: Format[] = [
  'jpeg',
  'png',
  'webp',
  'gif',
  'tiff',
  'avif',
  'heif',
]

export type Option = {
  width: number
  height: number
  bg: string
  color: string
  text: string
  format: Format
}

export function getOption(request: NextRequest, size: string): Option {
  const { searchParams } = request.nextUrl

  const [width, height] = size.split('x').map(Number)
  if (width <= 0 || height <= 0 || width > 5000 || height > 5000) {
    throw new OptionError(`Invalid width ${width} and height ${height}`)
  }

  const format = (searchParams.get('format') ?? 'png') as Format
  if (!SUPPORT_FORMAT_LIST.includes(format)) {
    throw new OptionError(`Invalid format ${format}`)
  }

  const bg = searchParams.get('bg') ?? 'ccc'
  const color = searchParams.get('color') ?? '000'
  const text = searchParams.get('text') ?? size

  return {
    width,
    height,
    bg,
    color,
    text,
    format,
  }
}

export const getImageResponse = async (option: Option) => {
  const bg = sharp({
    create: {
      width: option.width,
      height: option.height,
      background: '#' + option.bg,
      channels: 4,
    },
  })

  const markupText = `<span color="#${option.color}" background="#${option.bg}">${option.text}</span>`
  const image = bg.composite([
    {
      input: {
        text: {
          text: markupText,
          width: 0.6 * option.width,
          height: 0.6 * option.height,
          rgba: true,
        },
      },
    },
  ])

  const buffer = await image.toFormat(option.format).toBuffer()

  const headers = new Headers()
  headers.append('content-type', `image/${option.format}`)

  return new Response(buffer, { headers })
}

export class OptionError extends Error {
  constructor(public message: string) {
    super(message)
  }
}
