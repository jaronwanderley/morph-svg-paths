import { createEl, setClass, setStyle, typeOf } from './utils.js'

export function rippleDirective(context) {
  const { el, exp, get, effect } = context

  const set = () => {
    const options = exp ? get() : {}
    if (typeOf(options) !== 'Object') {
      console.error('The param need to be a Object!')
      return
    }
    setStyle(el, {
      position: 'relative',
      overflow: 'hidden',
    })
    if (el.rippleClick)
      el.removeEventListener('click', el.rippleClick)
    el.rippleClick = (event) => {
      // setup
      const { pageX, pageY } = event
      const { x, y, width, height } = el.getBoundingClientRect()
      const buttonSize = width > height ? width : height
      const buttonSizeString = `${buttonSize}px`
      // remove any previous ripples
      const ripples = [...el.querySelectorAll('.ripple')]
      ripples.forEach(ripple => el.removeChild(ripple))
      // create a new ripple
      const ripple = createEl('span')
      setClass(ripple, 'ripple')
      el.appendChild(ripple)
      // set the ripple to the click position and start animation
      setStyle(ripple, {
        width: buttonSizeString,
        height: buttonSizeString,
        top: `${pageY - y - buttonSize / 2}px`,
        left: `${pageX - x - buttonSize / 2}px`,
      })
      setClass(ripple, 'ripple-effect')
    }
    el.addEventListener('click', el.rippleClick, false)
  }

  set()
  effect(() => {
    set()
  })
}

export function windowSizeDirective(context) {
  const { exp, get, effect } = context
  window.resizeCallbacks = {
    ...window?.resizeCallbacks || {},
  }

  const set = () => {
    const {
      innerWidth: width,
      innerHeight: height,
    } = window
    const isPortrait = width < height

    Object.values(window.resizeCallbacks)
      .forEach((callBack) => {
        callBack({
          width,
          height,
          minSize: isPortrait ? width : height,
          maxSize: isPortrait ? height : width,
          isPortrait,
          isLandscape: !isPortrait,
        })
      })
  }
  const update = () => {
    const callBack = exp && get()
    if (typeOf(callBack) !== 'Function') {
      console.error('The param need to be a Function!')
      return
    }
    window.resizeCallbacks[exp] = callBack
  }

  window.onresize = set
  update()
  set()

  effect(() => {
    update()
  })
}
