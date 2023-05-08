/**
 * This is a very simple test file to make sure that
 * ESLint is working somewhat as expected. It is not crucial
 * for this project nor does it reflect any features.
 */
import { buildLinter, lintCode } from '../src/compiler/linter'

describe('linter', () => {
  const linter = buildLinter('vue/.eslintrc.js')

  it('should use single quotes (\'\') instead of double quotes ("")', async () => {
    const stringVarDeclaration = 'const foo = "bar"'
    const result = await lintCode(linter, stringVarDeclaration)
    expect(result).toBe('const foo = \'bar\'\n')
  })

  it('should NOT use semi-colon as line terminators', async () => {
    const statement = 'console.log(\'cenas\');'
    const result = await lintCode(linter, statement)
    expect(result).toBe('console.log(\'cenas\')\n')
  })

  it('should use 4 spaces indentation', async () => {
    const functionDeclaration =
`function foo(): string {
  if (1 > 2) {
    return 'cenas'
  } else {
    return 'other cenas'
  }
}`

    const expectedFunctionDeclaration =
`function foo (): string {
    if (1 > 2) {
        return 'cenas'
    } else {
        return 'other cenas'
    }
}
`
    const result = await lintCode(linter, functionDeclaration)
    expect(result).toBe(expectedFunctionDeclaration)
  })

  it('should use trailing commas', async () => {
    const objectDeclaration =
`const myObject = {
    foo: 'foo',
    bar: 'bar'
}

const myArray = [
    1,
    2
]`

    const expectedObjectDeclaration =
`const myObject = {
    foo: 'foo',
    bar: 'bar',
}

const myArray = [
    1,
    2,
]
`
    const result = await lintCode(linter, objectDeclaration)
    expect(result).toBe(expectedObjectDeclaration)
  })

  it('should clear property terminators on interfaces', async () => {
    const interfaceDeclaration =
`interface Foo {
    bar: string;
    baz: number;
}
`
    const expectedInterfaceDeclaration =
`interface Foo {
    bar: string
    baz: number
}
`
    const result = await lintCode(linter, interfaceDeclaration)
    expect(result).toBe(expectedInterfaceDeclaration)
  })

})