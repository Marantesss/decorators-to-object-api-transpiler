import { sync } from 'glob'
import { resolve } from 'path'
import { cwd } from 'process'

export const DUMMY_INPUT_PROJECT_NAME = 'input.ts'
export const DUMMY_OUTPUT_PROJECT_NAME = 'output.ts'

export function normalizeJson(str: string): string {
  return str.replace(/[\s\n\r\t]/gs, '').replace(/,([}\]])/gs, '$1')
    .replace(/([,{\[]|)(?:("|'|)([\w_\- ]+)\2:|)("|'|)(.*?)\4([,}\]])/gs, (str, start, q1, index, q2, item, end) => {
      item = item.replace(/"/gsi, '').trim()
      if (index) { index = '"' + index.replace(/"/gsi, '').trim() + '"' }
      if (!item.match(/^[0-9]+(\.[0-9]+|)$/) && !['true', 'false'].includes(item)) { item = '"' + item + '"' }
      if (index) { return start + index + ':' + item + end }
      return start + item + end
    })
}

export function capitalizeWord(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getStringAsObject(str: string): any {
  return JSON.parse(normalizeJson(str))
}

export function getPathFromWorkingDirectory(filepath: string): string {
  return resolve(cwd(), filepath)
}

export function getVueSFCFilePaths(glob: string): string[] {
  return sync(getPathFromWorkingDirectory(glob)).filter(_ => _.endsWith('.vue'))
}

export function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/([-_][a-z])/g, group =>
      group
        .toUpperCase()
        .replace('-', '')
        .replace('_', ''),
    )
}

export function notNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
