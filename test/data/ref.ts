import { SyntaxKind, PropertyDeclaration, Project } from 'ts-morph'
import { DUMMY_TEST_FILE, TestCase } from '.'
import { Ref } from '../../src/compiler/structures'


const TEST_CLASS_COMPONENT_CODE =
`export default class ExampleComponent extends mixins(MyMixin) {
  @Ref('myDiv')
  readonly myDiv!: HTMLDivElement

  @Ref('myOtherDiv')
  myOtherDiv!
}
`

const [myDiv, myOtherDiv] = new Project()
    .createSourceFile(DUMMY_TEST_FILE, TEST_CLASS_COMPONENT_CODE)
    .getDescendantsOfKind(SyntaxKind.PropertyDeclaration)

const myDivOptionsCode = 
`myDiv (): HTMLDivElement {
    return this.$refs.myDiv as HTMLDivElement
},
`

const refTestStructureMyDiv: TestCase<PropertyDeclaration, Ref> = {
  node: myDiv,
  code: myDivOptionsCode,
  structure: { name: 'myDiv', isReadonly: true, type: 'HTMLDivElement', value: undefined },
  description: 'should create ref from explicit declaration',
}

const myOtherDivOptionsCode = 
`myOtherDiv () {
    return this.$refs.myOtherDiv
},
`

const refTestStructureMyOtherDiv: TestCase<PropertyDeclaration, Ref> = {
  node: myOtherDiv,
  code: myOtherDivOptionsCode,
  structure: { name: 'myOtherDiv', isReadonly: false, type: undefined, value: undefined },
  description: 'should create ref from implicit declaration',
}

export const REF_TEST_CASES = [
  refTestStructureMyDiv,
  refTestStructureMyOtherDiv,
] as const
