import QuickLRU from 'quick-lru'
import sharp from 'sharp'
import { Option } from './option'
import { getImage } from './image'

const cache = new QuickLRU<string, sharp.Sharp>({ maxSize: 1000 })

const getCacheKey = (option: Option) => {
  return JSON.stringify(option)
}

export const getCacheImage = (option: Option) => {
  const cacheKey = getCacheKey(option)
  const cacheImage = cache.get(cacheKey)
  if (cacheImage) {
    return cacheImage
  } else {
    const image = getImage(option)
    cache.set(cacheKey, image)
    return image
  }
}
