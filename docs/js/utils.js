// DOM related
export const typeOf = element => typeof element == 'object' && element != null
  ? element.constructor.name
  : {}.toString.call(element).match(/\s(\w+)/)[1]

export const createEl = type => document.createElement(type)

export const setClass = (element, className) => className
  .split(' ')
  .map(name => element.classList.add(name))

export const setStyle = (element, object) => Object
  .entries(object)
  .map(([key, value]) => element.style[key] = value)

// Object related
export const get = (path, obj = window) => path
  .split(/[\.\[\]]+/).filter(e => e !== '')
  .reduce((prev, curr) => prev ? prev[parseInt(curr) ? parseInt(curr) : curr] : null, obj || self)

export const set = (path, object, value) => {
  const parts = path.split(/[\]\[.]/).filter(string => !!string)
  return parts.reduce((previous, current, index, array) => {
    if (index + 1 === parts.length)
      return previous[current] = value
    return previous[current] = previous[current] ? previous[current] : !isNaN(parseFloat(array[index + 1])) ? [] : {}
  }, object)
}

export const getListOfPaths = (obj = {}) => {
  const addDelimiter = (a, b) => a ? `${a}.${b}` : b
  const paths = (obj = {}, head = '') => {
    return Object.entries(obj)
      .reduce((result, [key, value]) => {
        const fullPath = addDelimiter(head, key)
        return typeOf(value) === 'Object'
          ? result.concat(paths(value, fullPath))
          : result.concat(fullPath)
      }, [])
  }
  return paths(obj)
}

// Array related
export const range = (start = 0, end = 0, step = 1) => Array(Math.floor((end - start) / step + 1))
  .fill()
  .map((_, index) => step * index + start)

// Math related
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

// Geometry related
export const getDistance = (p1, p2) => {
  const x = p2.x - p1.x
  const y = p2.y - p1.y
  return Math.sqrt(x * x + y * y)
}

// Content related
export const loadText = async (path) => {
  try {
    const result = await fetch(path)
    return await result.text()
  }
  catch (error) {
    return ''
  }
}

export const loadJson = async (path) => {
  try {
    const result = await fetch(path)
    return await result.json()
  }
  catch (error) {
    return ''
  }
}

// Browser related
export const getSelector = (elem) => {
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

export const platform = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  return {
    isMobile,
    isDesktop: !isMobile,
    isDark,
    isLight: !isDark,
  }
}
