// Math related
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

// Geometry related
export function getDistance(p1, p2) {
  const x = p2.x - p1.x
  const y = p2.y - p1.y
  return Math.sqrt(x * x + y * y)
}

// Content related
export async function loadText(path) {
  try {
    const result = await fetch(path)
    return await result.text()
  }
  catch (error) {
    return ''
  }
}
export async function loadJson(path) {
  try {
    const result = await fetch(path)
    return await result.json()
  }
  catch (error) {
    return ''
  }
}

// Browser related
export function getSelector(elem) {
  const {
    tagName,
    id,
    parentNode,
  } = elem

  const bodyTag = 'BODY'
  if (tagName === bodyTag)
    return bodyTag
  if (id)
    return `#${id}`

  let childIndex = 1
  for (let e = elem; e.previousElementSibling; e = e.previousElementSibling)
    childIndex++

  return `${getSelector(parentNode)}>${tagName}:nth-child(${childIndex})`
}

export function platform() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  return {
    isMobile,
    isDesktop: !isMobile,
    isDark,
    isLight: !isDark,
  }
}

