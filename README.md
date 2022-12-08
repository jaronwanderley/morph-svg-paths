# Morph SVG Paths
A Tiny ~1.4Kb function to morph between string paths with same commands. The package expose two functions to use.
## Example
To see a example in use go to [example](https://jaronwanderley.github.io/morph-svg-paths)

## Install
### Module
```
npm i @jrnwn/morph-svg-paths
```
#### CDN

```html
<script src="https://unpkg.com/@jrnwn/morph-svg-paths"><script>
```

### How to use
#### Module
```javascript
import { morphPaths, blendValues } from '@jrnwn/morph-svg-paths'
```
#### CDN
```javascript
const { morphPaths, blendValues } = MorpSVGPaths
```
#### Use it 
```javascript
const iconStates = [
  'm 0 0 c -2.6 -6.4 -8.7 -10.5 -15.6 -10.5 c -9.3 0   -16.8 7.5  -16.8 16.8 c 0   9.3 7.5  16.8 16.8 16.8 c 6.9 0   13  -4.2  15.6 -10.5 c 2.6  6.4  8.7   10.5 15.6  10.5 c 9.3 0 16.8 -7.5 16.8 -16.8     c  0   -9.3 -7.5  -16.8 -16.8 -16.8 c -6.9  0   -13    4.2  -15.6  10.5 z',
  'm 0 0 c -2.6 -6.4 -8.7 -10.5 -15.6 -10.5 c -9.3 0   -16.8 7.5  -16.8 16.8 c 0   9.3 10.6 18.8 16.8 24.8 c 5   4.7 9.8  8.9  15.6  12.7 c 5.4 -3.8  10.7 -8.7  15.6 -12.7 c 7.2 -5.9 16.8 -15.5 16.8 -24.8 c  0   -9.3 -7.5  -16.8 -16.8 -16.8 c -6.9  0   -13    4.2  -15.6  10.5 z',
  'm 0 0 c -5.2  5.1 -10.4 10.3 -15.6  15.4 c -5.6 5.6 -11.3 11.2 -16.9 16.8 c 5.6 5.6 11.3 11.2 16.9 16.8 c 5.2 5.3 10.4 10.6 15.6  15.9 c 5.2 -5.3  10.4 -10.6 15.6 -15.9 c 5.6 -5.6 11.2 -11.2 16.8 -16.8 c -5.6 -5.6 -11.2 -11.2 -16.8 -16.8 c -5.2 -5.1 -10.4 -10.3 -15.6 -15.4 z',
  'm 0 0 c -1.7  9.5 -3.3  19.1 -5     28.6 c -9.1 1.2 -18.3 2.4  -27.4 3.6  c 9.1 1.9 18.3 3.8  27.4 5.7  c 1.7 9   3.3  18.1 5     27.1 c 1.5 -9 3 -18.1  4.5 -27.1       c 9.3 -1.9 18.7 -3.8 28 -5.7     c -9.3 -1.4 -18.7 -2.7  -28   -4.1  c -1.5 -9.4 -3    -18.7 -4.5  -28.1 z',
]

// pass a array of string paths with same commands
const morphIcon = morphPaths(iconStates)
// pass a array of percentages to morph between paths
// the length need to be equal to array of paths
console.log(morphIcon([.1, .5, .3, .1]))


// pass a array of numbers
const values = [1,2,3,4,5]
// pass a array of percentages to morph between values
const percentages = [0, .1, .2, .3]
console.log(blendValues(values, percentages))
```

## License

[MIT](./LICENSE.md) License © 2022 [Jaron Wanderley](https://github.com/jaronwanderley)