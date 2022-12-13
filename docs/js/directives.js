import { getSelector } from './utils.js'

export function windowSizeDirective(context) {
  const { el, exp, get, effect } = context
  window.resizeCallbacks = {
    ...window?.resizeCallbacks || {},
  }
  window.onresize = onResize

  function update() {
    const callBack = exp ? get() : () => {}
    window.resizeCallbacks[getSelector(el)] = callBack
  }
  function onResize() {
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

  update()
  onResize()

  effect(() => {
    update()
  })
}
