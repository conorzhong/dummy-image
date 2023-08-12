import { NextRequest } from 'next/server'
import { OptionError, getOption } from './utils/option'
import { get304Response, getResponse } from './utils/response'

export async function GET(
  request: NextRequest,
  { params }: { params: { size: string } }
) {
  const response304 = get304Response(request)
  if (response304) {
    return response304
  }

  try {
    const { size } = params
    const option = getOption(request, size)
    return getResponse(option)
  } catch (e: OptionError | unknown) {
    let text
    if (e instanceof OptionError) {
      text = e.message
    } else {
      text = 'Error'
      console.error(e)
    }
    return getResponse({
      bg: 'fff',
      color: '000',
      format: 'png',
      height: 300,
      width: 400,
      text,
    })
  }
}
