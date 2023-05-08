import { SyntaxKind, ClassDeclaration, Project } from 'ts-morph'
import { DUMMY_TEST_FILE, TestCase } from '.'
import { Component } from '../../src/compiler/structures'


const TEST_CLASS_DECLARATIONS = `
@Component
export default class SimpleComponent extends Vue {}

@Component({
  components: {
    ChildComponent,
  },
})
export default class ParentComponent extends Vue {}

@Component({
  components: {
    NestedComponent,
    AnotherNestedComponent,
  },
})
export default class ComplexComponent extends Vue {}
`

const [simpleComponentNode, parentComponentNode, complexComponentNode] = new Project()
  .createSourceFile(DUMMY_TEST_FILE, TEST_CLASS_DECLARATIONS)
  .getChildrenOfKind(SyntaxKind.ClassDeclaration)

const simpleComponentOptionsCode = 
`name: 'SimpleComponent',
`

const simpleComponentTestCase: TestCase<ClassDeclaration, Component> = {
  node: simpleComponentNode,
  code: simpleComponentOptionsCode,
  structure: { name: 'SimpleComponent', importedComponents: [] },
  description: 'should create component structure from simple component',
}

const parentComponentOptionsCode = 
`name: 'ParentComponent',

components: {
    ChildComponent,
},
`

const parentComponentTestCase: TestCase<ClassDeclaration, Component> = {
  node: parentComponentNode,
  code: parentComponentOptionsCode,
  structure: { name: 'ParentComponent', importedComponents: ['ChildComponent'] },
  description: 'should create component structure from parent component with children',
}

const complexComponentOptionsCode = 
`name: 'ComplexComponent',

components: {
    NestedComponent,
    AnotherNestedComponent,
},
`

const complexComponentTestCase: TestCase<ClassDeclaration, Component> = {
  node: complexComponentNode,
  code: complexComponentOptionsCode,
  structure: { name: 'ComplexComponent', importedComponents: ['NestedComponent', 'AnotherNestedComponent'] },
  description: 'should create component structure from complex component with mixin and children',
}

export const COMPONENTS_TEST_CASES = [
  simpleComponentTestCase,
  parentComponentTestCase,
  complexComponentTestCase,
] as const

