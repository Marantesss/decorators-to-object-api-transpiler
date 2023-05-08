import { TestCase } from '.'
import { Mixin } from '../../src/compiler/structures'

const singleMixinCode = 'MyMixin,'

const singleMixinCodeTestCase: TestCase<string, Mixin> = {
  node: 'MyMixin',
  code: singleMixinCode,
  structure: { name: 'MyMixin' },
  description: 'should create component structure from simple component',
}

export const MIXIN_TEST_CASES = [
  singleMixinCodeTestCase,
] as const