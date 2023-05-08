/**
 * Represents a test case with:
 * 
 * - AST Node
 * - Generated structure representing the AST Node
 * - Generated options syntax code from the structure
 */
export interface TestCase<N, S> {
  /**
   * AST Node
   */
  node: N

  /**
   * Generated structure from AST Node
   */
  structure: S

  /**
   * Generated code from structure
   */
  code: string

  /**
   * Description of the test case
   */
  description?: string
}

export const DUMMY_TEST_FILE = 'test.ts'

export * from './methods'
export * from './compiler'
export * from './components'
export * from './computed'
export * from './prop'
export * from './ref'
export * from './data'
export * from './emit'
export * from './hook'
export * from './mixin'
export * from './watch'
