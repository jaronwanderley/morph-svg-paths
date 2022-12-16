import { createEl, getSelector, removeClass, setClass, setStyle, typeOf } from 'https://unpkg.com/@jrnwn/utils@0.0.1/dist/utils.iife.js'

export function rippleDirective(context) {
  const { el, exp, get, effect } = context

  effect(() => {
    const options = exp ? get() : {}
    const typeOptions = typeOf(options)
    if (typeOptions !== 'Object') {
      console.error(`The options of Ripple must be a Object! Got ${typeOptions}. Error on Element:\n${getSelector(el)}`)
      return
    }
    const { set, start, end } = options || {}

    setStyle(el, {
      position: 'relative',
      overflow: 'hidden',
    })

    if (el._RD)
      el.removeEventListener('click', el._RD)

    el._RD = (event) => {
      // setup
      const { pageX, pageY } = event
      const { x, y, width, height } = el.getBoundingClientRect()
      const buttonSize = width > height ? width : height
      const buttonSizeString = `${buttonSize}px`
      // remove any previous ripples
      const ripples = [...el.querySelectorAll('[ripple]')]
      ripples.forEach(ripple => el.removeChild(ripple))
      // create a new ripple
      const ripple = createEl('span')
      ripple.setAttribute('ripple', true)
      setClass(ripple, set || 'ripple')
      if (start)
        setClass(ripple, start)
      el.appendChild(ripple)
      // set the ripple to the click position and start animation
      setStyle(ripple, {
        width: buttonSizeString,
        height: buttonSizeString,
        top: `${pageY - y - buttonSize / 2}px`,
        left: `${pageX - x - buttonSize / 2}px`,
        pointerEvents: 'none',
      })
      setTimeout(() => {
        if (start)
          removeClass(ripple, start)
        setClass(ripple, end || 'ripple-effect')
      }, 5)
    }

    el.addEventListener('click', el._RD, false)
  })
}

export function windowSizeDirective(context) {
  const { el, exp, get, effect } = context

  effect(() => {
    const options = exp ? get() : {}
    const typeOptions = typeOf(options)
    const onResize = () => {
      const {
        innerWidth: width,
        innerHeight: height,
      } = window
      const isPortrait = width < height

      Object.values(window._WZD)
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
    if (typeOptions !== 'Function') {
      console.error(`The options of WindowSize must be a Function! Got ${typeOptions}. Error on Element:\n${getSelector(el)}`)
      return
    }
    if (!window._WZD) {
      window._WZD = {
        [exp]: options,
      }
      onResize()
      window.addEventListener('resize', onResize)
    }
    window._WZD[exp] = options
  })
}
