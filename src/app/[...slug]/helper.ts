export type Slug = string[]
export type Format = 'png' | 'jpeg'

export function getIamgeParams(slug: Slug) {
  const [width, height] = slug[0].split('x').map(Number)
  if (width <= 0 || height <= 0 || width > 5000 || height > 5000) {
    throw new Error(`Invalid width ${width} and height ${height}`)
  }

  const bgColor = `#${slug[1] ?? 'cccccc'}`

  // Format
  const matchArray = slug[2]?.match(/^(\w*)?(\.png|\.jpeg)?(\&text=.*)?$/)

  const color = `#${matchArray?.[1] ?? '000'}`
  const format =
    (matchArray?.[2]?.replace(/^\./, '') as undefined | Format) ?? 'png'
  const text = matchArray?.[3]?.replace(/^&text=/, '') ?? `${width}x${height}`
  const markupText = `<span color="${color}" background="${bgColor}">${text}</span>`

  return {
    width,
    height,
    bgColor,
    color,
    format,
    text,
    markupText,
  }
}
