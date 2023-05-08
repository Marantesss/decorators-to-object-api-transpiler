import { SourceFile } from 'ts-morph'
import { logger } from '../logger'
import {
  Prop, Component, Data, Ref, Method, Computed, Emit, Watch, Mixin, Hook,
} from './structures'
import type { VisitorFunction } from './visitors'

export interface SymbolTable {
  component?: Component,

  data: Data[]

  refs: Ref[]
  props: Prop[]

  hooks: Hook[]

  emits: Emit[]
  watch: Watch[]

  methods: Method[]
  getters: Computed[]

  mixins: Mixin[]
}

export function buildSymbolTable(sourceFile: SourceFile, visitors: VisitorFunction[]): SymbolTable {
  return visitors.reduce<SymbolTable>(
    (table: SymbolTable, visitor: VisitorFunction): SymbolTable =>
      sourceFile.forEachDescendantAsArray().reduce<SymbolTable>((_table, node) => visitor(node, _table), table),
    createEmptySymbolTable(),
  )
}

function createEmptySymbolTable(): SymbolTable {
  return {
    component: undefined,
    data: [],
    refs: [],
    props: [],
    hooks: [],
    emits: [],
    watch: [],
    methods: [],
    getters: [],
    mixins: [],
  }
}

export function dump(symbolTable: SymbolTable): void {
  const log = ({ name }: { name: string }) => logger.verbose(name)

  logger.verbose('--- component ---')
  logger.verbose(symbolTable.component?.name)

  logger.verbose('--- imported components ---')
  logger.verbose(symbolTable.component?.importedComponents)

  logger.verbose('--- data ---')
  symbolTable.data.forEach(log)

  logger.verbose('--- hook ---')
  symbolTable.hooks.forEach(log)

  logger.verbose('--- refs ---')
  symbolTable.refs.forEach(log)
  logger.verbose('--- props ---')
  symbolTable.props.forEach(log)

  logger.verbose('--- emit ---')
  symbolTable.emits.forEach(log)
  logger.verbose('--- watch ---')
  symbolTable.watch.forEach(log)

  logger.verbose('--- methods ---')
  symbolTable.methods.forEach(log)
  logger.verbose('--- getters/computed ---')
  symbolTable.getters.forEach(log)
}

/**
 * In practice just checks if a component name is present :shrug:
 * @param symbolTable symbol table
 * @returns true if symbol table empty
 */
export function isEmpty(symbolTable: SymbolTable): boolean {
  return !symbolTable.component
}

export function hasData(symbolTable: SymbolTable): boolean {
  return symbolTable.data.length !== 0
}

export function hasProps(symbolTable: SymbolTable): boolean {
  return symbolTable.props.length !== 0
}

export function hasMixins(symbolTable: SymbolTable): boolean {
  return symbolTable.mixins.length !== 0
}

export function hasWatch(symbolTable: SymbolTable): boolean {
  return symbolTable.watch.length !== 0
}

export function hasComputed(symbolTable: SymbolTable): boolean {
  return symbolTable.getters.length !== 0
    || symbolTable.refs.length !== 0
}

export function hasMethods(symbolTable: SymbolTable): boolean {
  return symbolTable.methods.length !== 0
    || symbolTable.emits.length !== 0
    || symbolTable.watch.length !== 0
}

export function hasEmits(symbolTable: SymbolTable): boolean {
  return symbolTable.emits.length !== 0
}

export function hasHooks(symbolTable: SymbolTable): boolean {
  return symbolTable.hooks.length !== 0
}

