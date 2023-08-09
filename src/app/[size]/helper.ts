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

export function getOption(request: NextRequest, size: string) {
  const { searchParams } = request.nextUrl

  const [width, height] = size.split('x').map(Number)
  if (width <= 0 || height <= 0 || width > 5000 || height > 5000) {
    throw new Error(`Invalid width ${width} and height ${height}`)
  }

  const format = (searchParams.get('format') ?? 'png') as Format
  if (!SUPPORT_FORMAT_LIST.includes(format)) {
    throw new Error(`Invalid format ${format}`)
  }

  const bgColor = `#${searchParams.get('bg') ?? 'ccc'}`
  const color = `#${searchParams.get('color') ?? '000'}`
  const text = searchParams.get('text') ?? size
  const markupText = `<span color="${color}" background="${bgColor}">${text}</span>`

  return {
    width,
    height,
    bgColor,
    color,
    text,
    format,
    markupText,
  }
}
