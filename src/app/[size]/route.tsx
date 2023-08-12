import { NextRequest } from 'next/server'
import { OptionError, getOption } from './utils/option'
import { getResponse } from './utils/response'

export async function GET(
  request: NextRequest,
  { params }: { params: { size: string } }
) {
  try {
    const { size } = params
    const option = getOption(request, size)
    return getResponse(option)
  } catch (e: OptionError | unknown) {
    console.error(e)
    return getResponse({
      bg: 'fff',
      color: '000',
      format: 'png',
      height: 300,
      width: 400,
      text: e instanceof OptionError ? e.message : 'Error',
    })
  }
}
