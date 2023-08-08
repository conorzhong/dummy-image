import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { getIamgeParams } from './helper'

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug

  const imageParams = getIamgeParams(slug)

  const sharpBg = await sharp({
    create: {
      width: imageParams.width,
      height: imageParams.height,
      background: imageParams.bgColor,
      channels: 4,
    },
  })

  const sharpText = await sharp({
    text: {
      text: imageParams.markupText,
      width: 0.6 * imageParams.width,
      height: 0.6 * imageParams.height,
      rgba: true,
    },
  })

  const format = imageParams.format

  const result = sharpBg.composite([
    { input: await sharpText[format]().toBuffer() },
  ])

  return new NextResponse(await result[format]().toBuffer())
}
