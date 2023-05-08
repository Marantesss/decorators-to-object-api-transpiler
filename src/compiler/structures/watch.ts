import { CodeBlockWriter, MethodDeclaration, SyntaxKind } from 'ts-morph'
import { getStringAsObject } from '../../utils'
import { createMethod, Method } from './method'

export type Watch = {
  name: string

  handler: Method

  immediate?: boolean

  deep?: boolean
}

export function createWatch(watch: MethodDeclaration): Watch {
  const [decorator] = watch.getChildrenOfKind(SyntaxKind.Decorator)
  const decoratorStructure = decorator.getStructure()
  const decoratorArguments = decoratorStructure.arguments as string[]

  const name = decoratorArguments[0].slice(1, -1) // remove ''
  const watchOptionsObject = decoratorArguments[1] ? getStringAsObject((decoratorStructure.arguments as string[])[1]) : {}
  const handler = createMethod(watch)

  return {
    name,
    handler,
    ...watchOptionsObject,
  }

}

export function generateWatch(watch: Watch, writer: CodeBlockWriter): CodeBlockWriter {
  return writer
    .write(`'${watch.name}': `).inlineBlock(() => {
      writer.writeLine(`handler: '${watch.handler.name}',`)
      watch.immediate !== undefined && writer.writeLine(`immediate: ${watch.immediate},`)
      watch.deep !== undefined && writer.writeLine(`deep: ${watch.deep},`)
    })
    .write(',').newLine()
}