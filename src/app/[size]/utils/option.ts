import { NextRequest } from 'next/server'
import sharp from 'sharp'

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

export class OptionError extends Error {
  constructor(public message: string) {
    super(message)
  }
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
