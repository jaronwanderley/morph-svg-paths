import { morphPaths } from 'https://unpkg.com/@jrnwn/morph-svg-paths@0.0.1/dist/morph-svg-paths.js?module'
import { clamp, getDistance, loadJson, loadText, platform } from './utils.js'
import { toHtml } from './markdown.js'

export function Body() {
  return {
    isDark: platform().isDark,
    showSheet: false,
    explanation: '',
    github: '',
    version: '0.0.0',
    async loadData() {
      try {
        const projectData = await loadJson('../../package.json')
        this.github = projectData.repository.url
          .replace(/git\+(.+?)\.git/g, '$1')
        this.version = projectData.version
        const text = await loadText('../../README.md')
        const howTo = text
          .replaceAll('\r', '\n')
          .replace(/(\n## Example\n(?:.|\n)+?)\n *?#/g, '\n#')
        this.explanation = toHtml(howTo)
      }
      catch (error) {
        // eslint-disable-next-line no-alert
        alert('Something goes wrong on loading content... please open a issue on Github!')
        console.error(error)
      }
    },
  }
}

export function Morph() {
  return {
    isMobile: platform().isMobile,
    showInfo: true,
    paths: [
      'm 0 25 c -2.6 -6.4 -8.7 -10.5 -15.6 -10.5 c -9.3 0   -16.8 7.5  -16.8 16.8 c 0   9.3 7.5  16.8 16.8 16.8 c 6.9 0   13  -4.2  15.6 -10.5 c 2.6  6.4  8.7   10.5 15.6  10.5 c 9.3 0 16.8 -7.5 16.8 -16.8     c  0   -9.3 -7.5  -16.8 -16.8 -16.8 c -6.9  0   -13    4.2  -15.6  10.5 z',
      'm 0 0  c -5.2  5.1 -10.4 10.3 -15.6  15.4 c -5.6 5.6 -11.3 11.2 -16.9 16.8 c 5.6 5.6 11.3 11.2 16.9 16.8 c 5.2 5.3 10.4 10.6 15.6  15.9 c 5.2 -5.3  10.4 -10.6 15.6 -15.9 c 5.6 -5.6 11.2 -11.2 16.8 -16.8 c -5.6 -5.6 -11.2 -11.2 -16.8 -16.8 c -5.2 -5.1 -10.4 -10.3 -15.6 -15.4 z',
      'm 0 21  c -2.6 -6.4 -8.7 -10.5 -15.6 -10.5 c -9.3 0   -16.8 7.5  -16.8 16.8 c 0   9.3 10.6 18.8 16.8 24.8 c 5   4.7 9.8  8.9  15.6  12.7 c 5.4 -3.8  10.7 -8.7  15.6 -12.7 c 7.2 -5.9 16.8 -15.5 16.8 -24.8 c  0   -9.3 -7.5  -16.8 -16.8 -16.8 c -6.9  0   -13    4.2  -15.6  10.5 z',
      'm 0 0 c -1.7  9.5 -3.3  19.1 -5     28.6 c -9.1 1.2 -18.3 2.4  -27.4 3.6  c 9.1 1.9 18.3 3.8  27.4 5.7  c 1.7 9   3.3  18.1 5     27.1 c 1.5 -9 3 -18.1  4.5 -27.1       c 9.3 -1.9 18.7 -3.8 28 -5.7     c -9.3 -1.4 -18.7 -2.7  -28   -4.1  c -1.5 -9.4 -3    -18.7 -4.5  -28.1 z',
    ],
    percentages: [0, 0.5, 0, 0.5],
    svgHeight: 0,
    lightPosition: 0,
    get morphPath() {
      return morphPaths(this.paths)(this.percentages)
    },
    updatePercentage(index, event) {
      this.percentages[index] = +event.target.value
    },
    onInteract(event) {
      if (this.showInfo)
        setTimeout(() => this.showInfo = false, 1000)

      const {
        type,
        clientX: mouseX,
        clientY: mouseY,
        touches: [{
          clientX: touchX,
          clientY: touchY,
        }] = [{}],
        target,
      } = event
      const { x, y, width, height } = target.getBoundingClientRect()

      const isTouch = type === 'touchmove'
      const useX = isTouch ? touchX : mouseX
      const useY = isTouch ? touchY : mouseY
      const point = {
        x: clamp(useX - x, 0, width) / width,
        y: clamp(useY - y, 0, height) / height,
      }
      const corners = [[0, 0], [1, 0], [0, 1], [1, 1]]
      const gradient = distance => -3 * 2 ** 0.5 / 4 * distance + 1.03
      const percentages = corners
        .map(([x, y]) => {
          const distance = getDistance(point, { x, y })
          return clamp(gradient(distance), 0, 1)
        })

      this.percentages = percentages
      this.lightPosition = -point.x * 10 + 5
    },
    onResize(context) {
      const { minSize, isLandscape } = context
      this.svgHeight = isLandscape ? minSize - 282 : minSize
    },
  }
}
