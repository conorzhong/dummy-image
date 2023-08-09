import { NextRequest } from 'next/server'
import sharp from 'sharp'
import { getOption } from './helper'

export async function GET(
  request: NextRequest,
  { params }: { params: { size: string } }
) {
  const { size } = params

  const option = getOption(request, size)

  const bg = sharp({
    create: {
      width: option.width,
      height: option.height,
      background: option.bgColor,
      channels: 4,
    },
  })

  const image = bg.composite([
    {
      input: {
        text: {
          text: option.markupText,
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
