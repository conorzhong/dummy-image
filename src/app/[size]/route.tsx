import { NextRequest } from 'next/server'
import { OptionError, getImageResponse, getOption } from './helper'

export async function GET(
  request: NextRequest,
  { params }: { params: { size: string } }
) {
  try {
    const { size } = params
    const option = getOption(request, size)
    return getImageResponse(option)
  } catch (e) {
    console.error(e)
    return getImageResponse({
      bg: 'fff',
      color: '000',
      format: 'png',
      height: 300,
      width: 400,
      text: e instanceof OptionError ? e.message : 'Error',
    })
  }
}
