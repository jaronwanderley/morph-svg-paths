export const blendValues = (values: number[] = [], percentages: number[] = []) => values
  .reduce((sum, current, index) => sum + current * (percentages[index] || 0), 0)

export function morphPaths(paths: String[] = []) {
  const needMsg = (elements: String, toBe: String) => `${elements} need to ${toBe}!`
  const emptySpace = ' '
  const toLowerCase = (value: String) => value.toLowerCase()

  const parsePath = (value: String) => value
    .replace(/,/g, emptySpace)
    .replace(/$/g, emptySpace)
    .replace(/ *([a-zA-Z]) */g, '$1')
    .replace(/(.*) +$/g, '$1')
    .replace(/([0-9]+)-/g, '$1 -')
    .replace(/ *(a-zA-Z) */g, '$1')
    .replace(/ *( ) */g, '$1')
    .replace(/\s{1,}/g, emptySpace)
    .replace(/ ($)/g, '$1')
    .match(/[a-zA-Z][0-9 .-]*/g)
    ?.filter(([command]) => 'mlthvcsqaz'
      .split('')
      .includes(toLowerCase(command)))
    .map(([command, ...values]) => ({
      command,
      values: values
        .join('')
        .split(emptySpace)
        .map(value => +value),
    }))

  if (!Array.isArray(paths))
    throw (needMsg('Parameter', 'be a array'))
  if (paths.length < 2)
    throw (needMsg('Number of paths', 'minimal of 2'))
  if (paths.some((path: String) => typeof path !== 'string'))
    throw (needMsg('Paths', 'be String'))

  const parsedPaths = paths
    .map(path => parsePath(path))
  const commandList = new Set(parsedPaths
    .map(path => path
      ?.map(({ command, values }) => `${command}${values.length}`)
      .join('')))
  if (commandList.size > 1)
    throw (needMsg('Paths', 'have same commands'))

  const morphPath = parsedPaths[0]
    ?.map(({ command, values }, commandIndex) => ({
      command,
      values: values
        .map((_, valueIndex) => parsedPaths
          .reduce((accumulator: number[], path) => {
            if (path)
              accumulator.push(path[commandIndex]?.values[valueIndex])
            return accumulator
          }, [])),
    }))

  return (percentages: number[] = []) => {
    if (percentages.length !== paths.length)
      throw (needMsg('Count of percentages', 'be equal to paths'))
    if (percentages.some(percentage => typeof percentage !== 'number'))
      throw (needMsg('Percentages', 'be numbers'))
    return morphPath
      ?.map(({ command, values }) => {
        const allValues = values
          .map(values => blendValues(values, percentages))
          .join(emptySpace)
        return `${command}${toLowerCase(command) === 'z' ? '' : emptySpace + allValues}`
      })
      .join(emptySpace)
  }
}
