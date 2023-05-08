import { CodeBlockWriter } from 'ts-morph'

export interface Mixin {
  name: string
}

export function createMixin(name: string): Mixin {
  return { name }
}

export function generateMixin(mixin: Mixin, writer: CodeBlockWriter): CodeBlockWriter {
  return writer.write(`${mixin.name},`)
}

