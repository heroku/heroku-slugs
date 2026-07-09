import {expect} from 'vitest'

function stripIndents(str: string) {
  str = str.trim().replaceAll(/\s+$/gm, '')

  const indent = (str.match(/^\s+[^$]/m) || [''])[0].length - 1
  const regexp = new RegExp(`^s{${indent}}`, 'mg')
  return str.replace(regexp, '')
}

const expectOutput = function (actual: string, expected: string) {
  return expect(actual.trim().replaceAll(/\s+$/gm, '')).toBe(stripIndents(expected))
}

export default expectOutput
