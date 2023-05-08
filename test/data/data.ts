import { Project, SyntaxKind, PropertyDeclaration } from 'ts-morph'
import { DUMMY_TEST_FILE, TestCase } from '.'
import { Data } from '../../src/compiler/structures'

const TEST_CLASS_COMPONENT_CODE =
`export default class ExampleComponent extends Vue {

  nullClassInstance: Moment | null = null

  initializedString: string = 'my string'
  
  uninitializedNumber: number

  private privateProperty: any

  public publicProperty: boolean = true

  private readonly readonlyProperty: string = 'my readonly property'
}
`

const [ nullClassInstance, initializedString, uninitializedNumber, privateProperty, publicProperty, readonlyProperty] = new Project()
  .createSourceFile(DUMMY_TEST_FILE, TEST_CLASS_COMPONENT_CODE)
  .getDescendantsOfKind(SyntaxKind.PropertyDeclaration)


const nullClassInstanceTestCase: TestCase<PropertyDeclaration, Data> = {
  node: nullClassInstance,
  code: 'nullClassInstance: null,\n',
  structure: { name: 'nullClassInstance', value: 'null', type: 'Moment | null', isReadonly: false },
  description: 'should generate null class instance',
}

const initializedStringTestCase: TestCase<PropertyDeclaration, Data> = {
  node: initializedString,
  code: 'initializedString: \'my string\',\n',
  structure: { name: 'initializedString', value: '\'my string\'', type: 'string', isReadonly: false },
  description: 'should generate initialized string property',
}

const uninitializedNumberTestCase: TestCase<PropertyDeclaration, Data> = {
  node: uninitializedNumber,
  code: 'uninitializedNumber: undefined,\n',
  structure: { name: 'uninitializedNumber', value: undefined, type: 'number', isReadonly: false },
  description: 'should generate uninitialized number property',
}

const privatePropertyTestCase: TestCase<PropertyDeclaration, Data> = {
  node: privateProperty,
  code: 'privateProperty: undefined,\n',
  structure: { name: 'privateProperty', value: undefined, type: 'any', isReadonly: false },
  description: 'should generate private property',
}

const publicPropertyTestCase: TestCase<PropertyDeclaration, Data> = {
  node: publicProperty,
  code: 'publicProperty: true,\n',
  structure: { name: 'publicProperty', value: 'true', type: 'boolean', isReadonly: false },
  description: 'should generate public property',
}

const readonlyPropertyTestCase: TestCase<PropertyDeclaration, Data> = {
  node: readonlyProperty,
  code: 'readonlyProperty: \'my readonly property\',\n',
  structure: { name: 'readonlyProperty', value: '\'my readonly property\'', type: 'string', isReadonly: true },
  description: 'should generate private property',
}

export const DATA_TEST_CASES = [
  nullClassInstanceTestCase,
  initializedStringTestCase,
  uninitializedNumberTestCase,
  privatePropertyTestCase,
  publicPropertyTestCase,
  readonlyPropertyTestCase,
] as const
