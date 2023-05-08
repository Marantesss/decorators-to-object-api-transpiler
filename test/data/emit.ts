import { MethodDeclaration, Project, SyntaxKind } from 'ts-morph'
import { DUMMY_TEST_FILE, TestCase } from '.'
import { Emit } from '../../src/compiler/structures'

const TEST_CLASS_COMPONENT_CODE =
`export default class ExampleComponent extends Vue {
  @Emit('my-event')
  emitMyEvent (): void {}

  @Emit('my-event-with-payload-param')
  emitMyEventWithPayloadParam (num: number): void {
      this.myDataOne = 'outra cena'
  }

  @Emit('my-event-with-payload-return')
  emitMyEventWithPayloadReturn (num: number): string {
    this.myPrivateData = 'more more stuff'
    return this.myPrivateData
  }
}
`

const [ emitMyEventNode, emitMyEventWithPayloadParamNode, emitMyEventWithPayloadReturnNode ] = new Project()
  .createSourceFile(DUMMY_TEST_FILE, TEST_CLASS_COMPONENT_CODE)
  .getDescendantsOfKind(SyntaxKind.MethodDeclaration)

const emitMyEventCode =
`emitMyEvent (): void {
    this.$emit('my-event')
},
`

const emitMyEventTestCase: TestCase<MethodDeclaration, Emit> = {
  node: emitMyEventNode,
  code: emitMyEventCode,
  structure: {
    name: 'emitMyEvent',
    statements: ['this.$emit(\'my-event\')'],
    event: 'my-event',
    returnType: 'void',
    parameters: [],
  },
  description: 'should generate basic emit event with no params or return',
}

const emitMyEventWithPayloadParamCode = 
`emitMyEventWithPayloadParam (num: number): void {
    this.myDataOne = 'outra cena'
    this.$emit('my-event-with-payload-param', num)
},
`

const emitMyEventWithPayloadParamTestCase: TestCase<MethodDeclaration, Emit> = {
  node: emitMyEventWithPayloadParamNode,
  code: emitMyEventWithPayloadParamCode,
  structure: {
    name: 'emitMyEventWithPayloadParam',
    statements: ['this.myDataOne = \'outra cena\'', 'this.$emit(\'my-event-with-payload-param\', num)'],
    returnType: 'void',
    event: 'my-event-with-payload-param',
    parameters: [
      { name: 'num', type: 'number' },
    ],
  },
  description: 'should generate emit event with params and no return',
}

const emitMyEventWithPayloadReturnCode = 
`emitMyEventWithPayloadReturn (num: number): void {
    this.myPrivateData = 'more more stuff'
    this.$emit('my-event-with-payload-return', this.myPrivateData, num)
},
`

const emitMyEventWithPayloadReturnTestCase: TestCase<MethodDeclaration, Emit> = {
  node: emitMyEventWithPayloadReturnNode,
  code: emitMyEventWithPayloadReturnCode,
  structure: {
    name: 'emitMyEventWithPayloadReturn',
    statements: ['this.myPrivateData = \'more more stuff\'', 'this.$emit(\'my-event-with-payload-return\', this.myPrivateData, num)'],
    event: 'my-event-with-payload-return',
    returnType: 'string',
    parameters: [
      { name: 'num', type: 'number' },
    ],
  },
  description: 'should generate emit event with params or return',
}

export const EMIT_TEST_CASES = [
  emitMyEventTestCase,
  emitMyEventWithPayloadParamTestCase,
  emitMyEventWithPayloadReturnTestCase,
] as const
