import { describe, expect, it } from 'vitest'
import { blendValues, morphPaths } from './index'

const percentageValues = [0.1, 0.2, 0.3, 0.4]

const equalCommandPaths = [
  'M 40 12 C 40 12 8 12 8 12 C 5.8 12 4 13.8 4 16 C 4 16 4 36 4 36 C 4 38.2 5.8 40 8 40 C 8 40 40 40 40 40 C 42.2 40 44 38.2 44 36 C 44 36 44 16 44 16 C 44 13.8 42.2 12 40 12 Z',
  'M 42.2 18 C 42.2 18 15.3 18 15.3 18 C 13.4 18 11.7 19.4 11.4 21.3 C 11.4 21.3 8.1 39.4 8.1 39.4 C 8.1 39.4 8 40 8 40 C 8 40 39.7 40 39.7 40 C 41.6 40 43.3 38.6 43.6 36.7 C 43.6 36.7 46.1 22.7 46.1 22.7 C 46.6 20.3 44.7 18 42.2 18 Z',
  'M 42.2 18 C 42.2 18 20 18 9 18 C 7 18 6 19 6 21 C 6 30 7 31 11 37 C 13 40 14 40 17 40 C 20 40 39.7 40 39.7 40 C 43 40 43 40 43.6 36.7 C 43.6 36.7 46.1 22.7 46.1 22.7 C 47 18 47 18 42.2 18 Z',
  'M 13 12 C 22 12 8 12 8 12 C 5.8 12 4 13.8 4 16 C 4 16 4 36 4 36 C 4 38.2 5.8 40 8 40 C 8 40 21 40 23 40 C 25 40 27 38 27 36 C 27 33 27 19 27 16 C 27 14 25 12 23 12 Z',
]
const slightlyDifferentCommandPaths = [
  'M 40 12 C 40 12 8 12 8 12 C 5.8 12 4 13.8 4 16 A 4 16 4 36 4 36 C 4 38.2 5.8 40 8 40 A 8 40 40 40 40 40 C 42.2 40 44 38.2 44 36 C 44 36 44 16 44 16 C 44 13.8 42.2 12 40 12 Z',
  'M 42.2 18 C 42.2 18 15.3 18 15.3 18 C 13.4 18 11.7 19.4 11.4 21.3 C 11.4 21.3 8.1 39.4 8.1 39.4 C 8.1 39.4 8 40 8 40 C 8 40 39.7 40 39.7 40 C 41.6 40 43.3 38.6 43.6 36.7 C 43.6 36.7 46.1 22.7 46.1 22.7 C 46.6 20.3 44.7 18 42.2 18 Z',
  'M 42.2 18 C 42.2 18 20 18 9 18 C 7 18 6 19 6 21 T 6 30 7 31 11 37 C 13 40 14 40 17 40 C 20 40 39.7 40 39.7 40 C 43 40 43 40 43.6 36.7 C 43.6 36.7 46.1 22.7 46.1 22.7 C 47 18 47 18 42.2 18 Z',
  'M 13 12 C 22 12 8 12 8 12 C 5.8 12 4 13.8 4 16 C 4 16 4 36 4 36 T 4 38.2 5.8 40 8 40 T 8 40 21 40 23 40 C 25 40 27 38 27 36 C 27 33 27 19 27 16 C 27 14 25 12 23 12 Z',
]
const differentCommandPaths = [
  'M 0 0 l 1 10',
  'm 13 12 C 22 12 8 12 8 12 C 5.8 12 4 13.8 4 16 z',
  'm 42.2 18 c 42.2 18 15.3 18 15.3 18 c 13.4 18 11.7 19.4 11.4 21.3 c 11.4 21.3 8.1 39.4 8.1 39.4 z',
  'm 10 20 l 23 30 z',
]
const notValidCommandPaths = [
  'M 40 12 C 40 12 8 12 8 12 C 5.8 12 4 13.8 4 16 B 4 16 4 36 4 36 C 4 38.2 5.8 40 8 40 C 8 40 40 40 40 40 C 42.2 40 44 38.2 44 36 C 44 36 44 16 44 16 C 44 13.8 42.2 12 40 12 Z',
  'M 42.2 18 C 42.2 18 15.3 18 15.3 18 C 13.4 18 11.7 19.4 11.4 21.3 R 11.4 21.3 8.1 39.4 8.1 39.4 C 8.1 39.4 8 40 8 40 C 8 40 39.7 40 39.7 40 C 41.6 40 43.3 38.6 43.6 36.7 C 43.6 36.7 46.1 22.7 46.1 22.7 C 46.6 20.3 44.7 18 42.2 18 Z',
  'M 42.2 18 C 42.2 18 20 18 9 18 C 7 18 6 19 6 21 C 6 30 7 31 11 37 Q 13 40 14 40 17 40 C 20 40 39.7 40 39.7 40 C 43 40 43 40 43.6 36.7 C 43.6 36.7 46.1 22.7 46.1 22.7 C 47 18 47 18 42.2 18 Z',
  'M 13 12 C 22 12 8 12 8 12 X 5.8 12 4 13.8 4 16 C 4 16 4 36 4 36 C 4 38.2 5.8 40 8 40 C 8 40 21 40 23 40 C 25 40 27 38 27 36 C 27 33 27 19 27 16 C 27 14 25 12 23 12 Z',
]

describe('#blendValues', () => {
  it('returns a number', () => {
    expect(blendValues())
      .toBe(0)

    expect(blendValues([1, 2, 3]))
      .toBe(0)

    expect(blendValues([1, 2, 3], [1, 1, 1]))
      .toBe(6)

    expect(blendValues([1, 2, 3], [0.5, 0.5]))
      .toBe(1.5)

    expect(blendValues([1, 2, 3], [0.5, 0.5, 0]))
      .toBe(1.5)
  })
})

describe('#morphPaths', () => {
  it('throw error without no parameters', () => {
    expect(() => morphPaths())
      .toThrowError('Number of paths need to minimal of 2!')
  })

  it('throw error with parameter not an array', () => {
    const expectedError = 'Parameter need to be a array!'

    expect(() => morphPaths(''))
      .toThrowError(expectedError)

    expect(() => morphPaths(0))
      .toThrowError(expectedError)

    expect(() => morphPaths(true))
      .toThrowError(expectedError)

    expect(() => morphPaths({}))
      .toThrowError(expectedError)
  })

  it('throw error with parameter array length less then 2 items', () => {
    const expectedError = 'Number of paths need to minimal of 2!'

    expect(() => morphPaths([]))
      .toThrowError(expectedError)

    expect(() => morphPaths(['']))
      .toThrowError(expectedError)

    expect(() => morphPaths([0]))
      .toThrowError(expectedError)

    expect(() => morphPaths([true]))
      .toThrowError(expectedError)

    expect(() => morphPaths([{}]))
      .toThrowError(expectedError)
  })

  it('throw error with parameter array has some different of string', () => {
    const expectedError = 'Paths need to be String!'

    expect(() => morphPaths([1, 2]))
      .toThrowError(expectedError)

    expect(() => morphPaths(['', 0]))
      .toThrowError(expectedError)

    expect(() => morphPaths([true, false]))
      .toThrowError(expectedError)

    expect(() => morphPaths([{}, '']))
      .toThrowError(expectedError)

    expect(() => morphPaths([{}, false, true]))
      .toThrowError(expectedError)
  })

  it('throw error with parameter array has paths with different amount of commands', () => {
    const expectedError = 'Paths need to have same commands!'

    expect(() => morphPaths(slightlyDifferentCommandPaths))
      .toThrowError(expectedError)

    expect(() => morphPaths(differentCommandPaths))
      .toThrowError(expectedError)

    expect(() => morphPaths(notValidCommandPaths))
      .toThrowError(expectedError)
  })

  it('returns a function if all paths on array parameter has same amount of commands', () => {
    expect(() => morphPaths(equalCommandPaths.slice(0, 2)))
      .toBeInstanceOf(Function)

    expect(() => morphPaths(equalCommandPaths.slice(0, 3)))
      .toBeInstanceOf(Function)

    expect(() => morphPaths(equalCommandPaths))
      .toBeInstanceOf(Function)
  })

  it('throw error if percentages passed to use function has not the same length then paths', () => {
    const expectedError = 'Count of percentages need to be equal to paths!'

    expect(() => morphPaths(equalCommandPaths.slice(0, 2))([]))
      .toThrowError(expectedError)

    expect(() => morphPaths(equalCommandPaths.slice(0, 2))(percentageValues.slice(0, 1)))
      .toThrowError(expectedError)

    expect(() => morphPaths(equalCommandPaths.slice(0, 3))([]))
      .toThrowError(expectedError)

    expect(() => morphPaths(equalCommandPaths.slice(0, 3))(percentageValues.slice(0, 1)))
      .toThrowError(expectedError)

    expect(() => morphPaths(equalCommandPaths.slice(0, 3))(percentageValues.slice(0, 2)))
      .toThrowError(expectedError)

    expect(() => morphPaths(equalCommandPaths)([]))
      .toThrowError(expectedError)

    expect(() => morphPaths(equalCommandPaths)(percentageValues.slice(0, 1)))
      .toThrowError(expectedError)

    expect(() => morphPaths(equalCommandPaths)(percentageValues.slice(0, 2)))
      .toThrowError(expectedError)

    expect(() => morphPaths(equalCommandPaths)(percentageValues.slice(0, 3)))
      .toThrowError(expectedError)
  })

  it('throw error if percentages passed has some item different of a number', () => {
    const expectedError = 'Percentages need to be numbers!'
    expect(() => morphPaths(equalCommandPaths)([0, 0, 0, '']))
      .toThrowError(expectedError)

    expect(() => morphPaths(equalCommandPaths)([1, 0.5, false, '']))
      .toThrowError(expectedError)

    expect(() => morphPaths(equalCommandPaths)([true, {}, [], '']))
      .toThrowError(expectedError)
  })

  it('returns a string using the valid paths and percentages', () => {
    const pathMorph = morphPaths(equalCommandPaths)

    expect(pathMorph(percentageValues))
      .toBeTypeOf('string')

    expect(pathMorph([0, 0, 0, 0]))
      .toBe('M 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 C 0 0 0 0 0 0 Z')

    expect(pathMorph([1, 0, 0, 0]))
      .toBe(equalCommandPaths[0])

    expect(pathMorph([0, 1, 0, 0]))
      .toBe(equalCommandPaths[1])

    expect(pathMorph([0, 0, 1, 0]))
      .toBe(equalCommandPaths[2])

    expect(pathMorph([0, 0, 0, 1]))
      .toBe(equalCommandPaths[3])

    expect(pathMorph(percentageValues))
      .toBe('M 30.3 15 C 33.900000000000006 15 13.059999999999999 15 9.760000000000002 15 C 7.68 15 6.139999999999999 16.48 6.08 18.560000000000002 C 6.08 21.26 5.720000000000001 35.18 6.92 36.98 C 7.52 38.980000000000004 8.700000000000001 40 10.7 40 C 11.600000000000001 40 32.25 40 33.050000000000004 40 C 35.44 40 36.760000000000005 38.74 37 36.35 C 37 35.150000000000006 38.25 20.55 38.25 19.35 C 38.620000000000005 16.44 37.260000000000005 15 34.300000000000004 15 Z')
  })
})
