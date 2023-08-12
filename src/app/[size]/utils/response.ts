import { NextRequest, NextResponse } from 'next/server'
import { getCacheImage } from './cache'
import { Option } from './option'
import dayjs from 'dayjs'

const lastModified = dayjs()

export const getResponse = async (option: Option) => {
  const image = getCacheImage(option)
  const buffer = await image.toFormat(option.format).toBuffer()

  const headers = new Headers()

  headers.set('content-type', `image/${option.format}`)
  headers.set(
    'content-disposition',
    `inline; filename="${option.width}x${option.height}.dummy-image.${option.format}"`
  )

  headers.set(
    'cache-control',
    'public, max-age=600, stale-while-revalidate=3600'
  )
  headers.set('last-modified', lastModified.toString())

  return new Response(buffer, { headers })
}

export const get304Response = (request: NextRequest) => {
  const ifModifiedSinceString = request.headers.get('if-modified-since')
  if (ifModifiedSinceString) {
    const ifModifiedSince = dayjs(ifModifiedSinceString)
    if (lastModified.isSame(ifModifiedSince, 's')) {
      return new Response(null, { status: 304 })
    }
  }
}
