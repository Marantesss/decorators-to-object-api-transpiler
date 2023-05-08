import { CodeBlockWriter, PropertyDeclaration } from 'ts-morph'

export type Data = {
  name: string

  value?: string

  type?: string // can be inferred

  isReadonly: boolean
}

export function createData(data: PropertyDeclaration): Data {
  const structure = data.getStructure()

  const name = structure.name
  const value = structure.initializer as string | undefined
  const type = structure.type as string | undefined
  const isReadonly = !!structure.isReadonly

  return { name, value, type, isReadonly }
}

export function generateData(data: Data, writer: CodeBlockWriter): CodeBlockWriter {
  return writer.writeLine(`${data.name}: ${data.value},`)
}

/**
 * 
 * readonly data is typed as a computed property which always returns the same value
 */
export function generateReadonlyData(data: Data, writer: CodeBlockWriter): CodeBlockWriter {
  return writer
    .write(`${data.name}()${data.type ? `: ${data.type} ` : ' '}`).inlineBlock(() => {
      writer.writeLine(`return ${data.value!}`)
    })
    .write(',').newLine()
}