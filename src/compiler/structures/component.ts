import { ClassDeclaration, CodeBlockWriter, SyntaxKind } from 'ts-morph'

export type Component = {
  name: string

  importedComponents: string[]
}

export function createComponent(component: ClassDeclaration): Component {
  const structure = component.getStructure()
  const decorator = component.getFirstChildByKindOrThrow(SyntaxKind.Decorator)

  const name = structure.name!
  const importedComponents = decorator.getStructure().arguments ? decorator
    .getFirstDescendantByKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    .getFirstDescendantByKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    .getText() // { \n              Component1,\n             Component2, \n        }
    .slice(1, -1) // \n              Component1,\n             Component2, \n        
    .split(',') // ['\n              Component1', '\n             Component2', '\n        ',]
    .map(_ => _.trim()) // ['Component1', 'Component2', '']
    .filter(_ => !!_) // ['Component1', 'Component2']
    : []

  return { name, importedComponents }
}

export function generateComponent(component: Component, writer: CodeBlockWriter): CodeBlockWriter {
  writer.writeLine(`name: '${component.name}',`)

  if (component.importedComponents.length !== 0) {
    writer.blankLine().write('components: ').inlineBlock(() => {
      component.importedComponents.forEach(c => writer.writeLine(`${c},`))
    })
      .write(',').newLine()
  }

  return writer
}
