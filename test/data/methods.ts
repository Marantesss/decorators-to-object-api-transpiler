import { DUMMY_TEST_FILE, TestCase } from '.'
import { Method } from '../../src/compiler/structures'
import { Project, SyntaxKind, MethodDeclaration } from 'ts-morph'

const METHOD_TEST_CLASS_COMPONENT_CODE = 
`export default class ExampleComponent extends mixins(MyMixin) {
  logSomething (something) {
    console.log(something)
  }

  doMath(a: number, b: number): number {
    return a + b
  }

  doSomethingWithRef() {
    this.myDiv.addEventListener('click', () => this.logSomething(this.doMath(1,1)))
  }

  emitAllTheThings (): void {
    this.emitMyEvent()
    this.emitMyEventWithPayloadParam(2)
    this.emitMyEventWithPayloadReturn(2)
  }

  async doSomethingAsync(): CenasType | undefined {
    try {
        const cenas = await fetchCenas()
        return cenas
    } catch (_error) {
        console.error(_error)
    }
    const t = (blah: number) => {
        const hehe = 'hjehe'
    }

    function a(blah: number) {
        return 'blah' + blah
    }

    const cenas =
        await fetchOutraCena()
    return cenas
  }
}
`

const [logSomethingNode, doMathNode, doSomethingWithRefNode, emitAllTheThingsNode, doSomethingAsyncNode] = new Project()
  .createSourceFile(DUMMY_TEST_FILE, METHOD_TEST_CLASS_COMPONENT_CODE)
  .getDescendantsOfKind(SyntaxKind.MethodDeclaration)

const logSomethingCode = 
`logSomething (something) {
    console.log(something)
},
`

const logSomethingMethodTestCase: TestCase<MethodDeclaration, Method> = {
  node: logSomethingNode,
  code: logSomethingCode,
  structure: {
    name: 'logSomething',
    parameters: [{ name: 'something', type: undefined }],
    returnType: undefined,
    statements: ['console.log(something)'],
  },
  description: 'should create method from implicit declaration',
}

const doMathCode = 
`doMath (a: number, b: number): number {
    return a + b
},
`

const doMathMethodTestCase: TestCase<MethodDeclaration, Method> = {
  node: doMathNode,
  code: doMathCode,
  structure: {
    name: 'doMath',
    parameters: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
    ],
    returnType: 'number',
    statements: ['return a + b'],
  },
  description: 'should create method from explicit declaration',
}

const doSomethingWithRefCode = 
`doSomethingWithRef () {
    this.myDiv.addEventListener('click', () => this.logSomething(this.doMath(1,1)))
},
`

const doSomethingWithRefMethodTestCase: TestCase<MethodDeclaration, Method> = {
  node: doSomethingWithRefNode,
  code: doSomethingWithRefCode,
  structure: {
    name: 'doSomethingWithRef',
    parameters: [],
    returnType: undefined,
    statements: ['this.myDiv.addEventListener(\'click\', () => this.logSomething(this.doMath(1,1)))'],
  },
  description: 'should create method from implicit declaration',
}

const emitAllTheThingsCode = 
`emitAllTheThings (): void {
    this.emitMyEvent()
    this.emitMyEventWithPayloadParam(2)
    this.emitMyEventWithPayloadReturn(2)
},
`

const emitAllTheThingsMethodTestCase: TestCase<MethodDeclaration, Method> = {
  node: emitAllTheThingsNode,
  code: emitAllTheThingsCode,
  structure: {
    name: 'emitAllTheThings',
    parameters: [],
    returnType: 'void',
    statements: [
      'this.emitMyEvent()',
      'this.emitMyEventWithPayloadParam(2)',
      'this.emitMyEventWithPayloadReturn(2)',
    ],
  },
  description: 'should create method from implicit declaration',
}

const doSomethingAsyncCode = 
`async doSomethingAsync (): CenasType | undefined {
    try {
        const cenas = await fetchCenas()
        return cenas
    } catch (_error) {
        console.error(_error)
    }
    const t = (blah: number) => {
            const hehe = 'hjehe'
        }
    function a(blah: number) {
        return 'blah' + blah
    }
    const cenas = await fetchOutraCena()
    return cenas
},
`

const doSomethingAsyncMethodTestCase: TestCase<MethodDeclaration, Method> = {
  node: doSomethingAsyncNode,
  code: doSomethingAsyncCode,
  structure: {
    name: 'doSomethingAsync',
    parameters: [],
    returnType: 'CenasType | undefined',
    isAsync: true,
  },
  description: 'should create complex async method',
}

export const METHOD_TEST_CASES = [
  logSomethingMethodTestCase,
  doMathMethodTestCase,
  doSomethingWithRefMethodTestCase,
  emitAllTheThingsMethodTestCase,
  doSomethingAsyncMethodTestCase,
] as const
