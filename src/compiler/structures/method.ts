import { CodeBlockWriter, FunctionDeclarationStructure, KindedStructure, MethodDeclaration, MethodDeclarationStructure, OptionalKind, ParameterDeclarationStructure, StatementStructures, StructureKind, VariableStatementStructure, WriterFunction } from 'ts-morph'

export type Method = Omit<MethodDeclarationStructure, 'kind'>

export function createMethod(method: MethodDeclaration): Method {
  const structure = method.getStructure() as MethodDeclarationStructure

  return structure
}

export function generateMethod(method: Method, writer: CodeBlockWriter): CodeBlockWriter {
  return writer
    .write(buildMethodDeclaration(method)).inlineBlock(() => {
      (method.statements as (string | WriterFunction | StatementStructures)[]).forEach(
        s => buildStatementDeclaration(s, writer),
      )
    })
    .write(',').newLine()
}

function buildMethodDeclaration(method: Method): string {
  const parameters = method.parameters?.map(buildMethodParameterDeclaration).join(', ')
  return `${method.isAsync ? 'async ' : ''}${method.name} (${parameters})${buildMethodReturnTypeDeclaration(method)} `
}

function buildMethodParameterDeclaration({ name, type }: OptionalKind<ParameterDeclarationStructure>): string {
  return name + (type ? `: ${type}` : '')
}

function buildMethodReturnTypeDeclaration(method: Method): string {
  return method.returnType ? `: ${method.returnType}` : ''
}

function buildStatementDeclaration(statement: string | WriterFunction | StatementStructures, writer: CodeBlockWriter): void {
  if (typeof statement === 'string') {
    writer.writeLine(statement)
  } else if (typeof statement === 'function') {
    statement(writer)
  } else {
    // HACK the most laughable spaghetti code I've ever written :/
    // to understand what this does, please refer to 'test/data/method.ts' -> 'should create complex async method'
    const statementType = (statement as KindedStructure<StructureKind>).kind
    switch (statementType) {
      // const myFunction = (): ReturnType => { ... }
      case StructureKind.VariableStatement:
        const vss = statement as VariableStatementStructure
        writer.writeLine(`${vss.declarationKind} ${vss.declarations.map(_ => `${_.name} = ${_.initializer}`)}`)
        break
      // function myFunction(): ReturnType { ... }
      case StructureKind.Function:
        const fds = statement as FunctionDeclarationStructure
        const parameters = fds.parameters?.map(buildMethodParameterDeclaration).join(', ')
        writer.write(`${fds.isAsync ? 'async ' : ''}function ${fds.name}(${parameters})${fds.returnType ? `: ${fds.returnType}` : ''} `).inlineBlock(() => {
          (fds.statements as (string | WriterFunction | StatementStructures)[]).forEach(
            s => buildStatementDeclaration(s, writer),
          )
        }).newLine()
        break
    }
  }
}

