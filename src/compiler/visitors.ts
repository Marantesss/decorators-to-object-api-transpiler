import { cloneDeep } from 'lodash'
import {
  ClassDeclaration, GetAccessorDeclaration, MethodDeclaration, Node, PropertyDeclaration, SyntaxKind,
} from 'ts-morph'
import {
  createProp, createComponent, createData, createRef, createMethod, createComputed, createEmit, createWatch, createMixin, isHookType, createHook,
} from './structures'
import { SymbolTable } from './symbol-table'

/**
 * A visitor function receives a node and a symbol table and returns a deep copy of that symbol table
 * which may or may not be updated from visiting the node
 * 
 * @param {Node} node AST node to be visited
 * @param {SymbolTable} symbolTable symbol table before visiting the node
 * @returns {SymbolTable} symbol table after visiting the node
 */
export type VisitorFunction = (node: Node, symbolTable: SymbolTable) => SymbolTable

/**
 * Visits a node:
 * 1. If type @see {ClassDeclaration} then updates symbol table component property
 * 2. If anything else, does nothing
 * 
 * @returns symbol table
 */
const classDeclarationDecoratorVisitor: VisitorFunction = (node: Node, symbolTable: SymbolTable): SymbolTable => {
  const returnSymbolTable = cloneDeep(symbolTable)

  const decorators = node.getChildrenOfKind(SyntaxKind.Decorator)
  if (decorators.length === 0 || node.getKind() !== SyntaxKind.ClassDeclaration) {
    return returnSymbolTable
  }

  // assume there is only one decorator per class declaration
  const [decoratorIdentifier, ...rest] = decorators.flatMap(_ => _.getStructure().name)
  // 1. might be a call expression
  // @Component({ MyChildComponent })
  // 2. or simply an identifier
  // @Component

  if (rest.length !== 0) {
    throw new Error(`${node.getKindName()} with more than 1 decorator: ${[decoratorIdentifier, ...rest]}`)
  }

  if (decoratorIdentifier !== 'Component') {
    throw new Error(`${node.getKindName()} with unknown decorator: ${decoratorIdentifier}`)
  }

  returnSymbolTable.component = createComponent((node as ClassDeclaration))

  return returnSymbolTable
}

/**
 * Visits a node:
 * 1. If type @see {ClassDeclaration} and extends mixin(<something>), we save that <something> mixin on symbol table
 * 2. If anything else, does nothing
 * 
 * @returns symbol table
 */
const classDeclarationMixinVisitor: VisitorFunction = (node: Node, symbolTable: SymbolTable): SymbolTable => {
  const returnSymbolTable = cloneDeep(symbolTable)

  const heritage = node.getChildrenOfKind(SyntaxKind.HeritageClause)
  if (heritage.length === 0 || node.getKind() !== SyntaxKind.ClassDeclaration) {
    return returnSymbolTable
  }

  // assume there is only one decorator per property declaration
  const [callExpression, ...restExpressions] = heritage.flatMap(_ => _.getTypeNodes()).flatMap(_ => _.getChildrenOfKind(SyntaxKind.CallExpression))

  if (!callExpression) {
    return returnSymbolTable
  }

  const [mixinIdentifier, ...rest] = [callExpression, ...restExpressions].map(_ => _.getExpression().getText())

  if (rest.length !== 0 || restExpressions.length !== 0) {
    throw new Error(`${node.getKindName()} with more than 1 heritage clause: ${[mixinIdentifier, ...rest]}`)
  }

  if (mixinIdentifier !== 'Mixins') {
    throw new Error(`${node.getKindName()} with unknown heritage clause: ${mixinIdentifier}`)
  }

  returnSymbolTable.mixins = [
    ...returnSymbolTable.mixins,
    ...callExpression.getArguments().map(arg => createMixin(arg.getText())),
  ]

  return returnSymbolTable
}

/**
 * Visits a node:
 * 1. If type @see {PropertyDeclaration} and has no decorators, then it is probably a simple data property
 * which we take to update the symbol table's data property
 * 2. If anything else, does nothing
 * 
 * @returns symbol table
 */
const propertyDeclarationDataVisitor: VisitorFunction = (node: Node, symbolTable: SymbolTable): SymbolTable => {
  const returnSymbolTable = cloneDeep(symbolTable)
  const decorators = node.getChildrenOfKind(SyntaxKind.Decorator)

  if (decorators.length !== 0 || node.getKind() !== SyntaxKind.PropertyDeclaration) {
    return returnSymbolTable
  }

  returnSymbolTable.data = [...returnSymbolTable.data, createData(node as PropertyDeclaration)]

  return returnSymbolTable
}

/**
 * Visits a node:
 * 1. If type @see {PropertyDeclaration} and has decorators, then it is either a `Ref()` or `Prop()` decorator
 * which we take to update the symbol table's ref or prop property accordingly
 * 2. If anything else, does nothing
 * 
 * @returns symbol table
 * 
 * ```ts
 * @Ref('myDiv', {})
 * readonly myDiv!: HTMLDivElement
 * ```
 * 
 * forEachChild AST:
 * 
 * ```txt
 * PropertyDeclaration
 *      Decorator - @Ref('myDiv', {})
 *          Call Expression - Ref('myDiv', {})
 *              Identifier - Ref
 *              StringLiteral - 'myDiv'
 *              ObjectLiteral - {}
 *      ReadonlyKeyword - readonly
 *      Identifier - myDiv
 *      ExclamationToken - !
 *      TypeReference - HTMLDivElement
 *          Identifier - HTMLDivElement
 * ```
 */
const propertyDeclarationWithDecoratorVisitor: VisitorFunction = (node: Node, symbolTable: SymbolTable): SymbolTable => {
  const returnSymbolTable = cloneDeep(symbolTable)
  const decorators = node.getChildrenOfKind(SyntaxKind.Decorator)

  if (decorators.length === 0 || node.getKind() !== SyntaxKind.PropertyDeclaration) {
    return returnSymbolTable
  }

  // assume there is only one decorator per property declaration
  const [decoratorIdentifier, ...rest] = decorators.flatMap(_ => _.getCallExpressionOrThrow().getChildrenOfKind(SyntaxKind.Identifier).map(_ => _.getText()))

  if (rest.length !== 0) {
    throw new Error(`${node.getKindName()} with more than 1 decorator: ${[decoratorIdentifier, ...rest]}`)
  }

  switch (decoratorIdentifier) {
    case 'Ref':
      returnSymbolTable.refs = [...returnSymbolTable.refs, createRef(node as PropertyDeclaration)]
      break
    case 'Prop':
      returnSymbolTable.props = [...returnSymbolTable.props, createProp(node as PropertyDeclaration)]
      break
    default:
      throw new Error(`${node.getKindName()} with unknown decorator: ${decoratorIdentifier}`)
  }

  return returnSymbolTable
}

/**
 * Visits a node:
 * 1. If type @see {MethodDeclaration} and has decorators, then it is probably `Watch` or `Emit` method
 * which we take to update the symbol table's watch or emit property accordingly
 * 2. If anything else, does nothing
 * 
 * @returns symbol table
 */
const methodDeclarationWithDecoratorVisitor: VisitorFunction = (node: Node, symbolTable: SymbolTable): SymbolTable => {
  const returnSymbolTable = cloneDeep(symbolTable)
  const decorators = node.getChildrenOfKind(SyntaxKind.Decorator)

  if (decorators.length === 0 || node.getKind() !== SyntaxKind.MethodDeclaration) {
    return returnSymbolTable
  }

  // assume there is only one decorator per property declaration
  const [decoratorIdentifier, ...rest] = decorators.flatMap(_ => _.getCallExpressionOrThrow().getChildrenOfKind(SyntaxKind.Identifier).map(_ => _.getText()))

  if (rest.length !== 0) {
    throw new Error(`${node.getKindName()} with more than 1 decorator: ${[decoratorIdentifier, ...rest]}`)
  }

  switch (decoratorIdentifier) {
    case 'Watch':
      returnSymbolTable.watch = [...returnSymbolTable.watch, createWatch(node as MethodDeclaration)]
      break
    case 'Emit':
      returnSymbolTable.emits = [...returnSymbolTable.emits, createEmit(node as MethodDeclaration)]
      break
    default:
      throw new Error(`${node.getKindName()} with unknown decorator: ${decoratorIdentifier}`)
  }

  return returnSymbolTable
}

/**
 * Visits a node:
 * 1. If type @see {MethodDeclaration} and has no decorators, then it is probably a lifecycle hook or a regular method
 * which we take to update the symbol table's hooks or methods property accordingly
 * 2. If anything else, does nothing
 * 
 * @returns symbol table
 */
const methodDeclarationVisitor: VisitorFunction = (node: Node, symbolTable: SymbolTable): SymbolTable => {
  const returnSymbolTable = cloneDeep(symbolTable)
  const decorators = node.getChildrenOfKind(SyntaxKind.Decorator)

  if (decorators.length !== 0 || node.getKind() !== SyntaxKind.MethodDeclaration) {
    return returnSymbolTable
  }

  const methodName = node.getFirstChildByKindOrThrow(SyntaxKind.Identifier).getText()

  if (isHookType(methodName)) {
    returnSymbolTable.hooks = [...returnSymbolTable.hooks, createHook(node as MethodDeclaration)]
  } else {
    returnSymbolTable.methods = [...returnSymbolTable.methods, createMethod(node as MethodDeclaration)]
  }

  return returnSymbolTable

}

/**
 * Visits a node:
 * 1. If type @see {GetAccessorDeclaration}, then it is a computed property
 * which we take to update the symbol table's getters property accordingly
 * 2. If anything else, does nothing
 * 
 * @returns symbol table
 */
const getAccessorDeclarationVisitor: VisitorFunction = (node: Node, symbolTable: SymbolTable): SymbolTable => {
  const returnSymbolTable = cloneDeep(symbolTable)
  const decorators = node.getChildrenOfKind(SyntaxKind.Decorator)

  if (decorators.length !== 0 || node.getKind() !== SyntaxKind.GetAccessor) {
    return returnSymbolTable
  }

  returnSymbolTable.getters = [...returnSymbolTable.getters, createComputed(node as GetAccessorDeclaration)]

  return returnSymbolTable
}

/**
 * VisitorFunctions are exported via an array with is iterated via reduce
 */
export const visitors: VisitorFunction[] = [
  classDeclarationDecoratorVisitor,
  classDeclarationMixinVisitor,
  propertyDeclarationDataVisitor,
  propertyDeclarationWithDecoratorVisitor,
  methodDeclarationWithDecoratorVisitor,
  methodDeclarationVisitor,
  getAccessorDeclarationVisitor,
]