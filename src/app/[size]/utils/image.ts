import sharp from 'sharp'
import { Option } from './option'

export const getImage = (option: Option) => {
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

  return image
}
