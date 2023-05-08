import { CodeBlockWriter, PropertyAssignment, PropertyDeclaration, SyntaxKind } from 'ts-morph'

const VUE_PROP_PROPERTY_IDENTIFIERS = [
  'type',
  'default',
  'validator',
  'required',
] as const

export type PropPropertyType = typeof VUE_PROP_PROPERTY_IDENTIFIERS[number]


export type Prop = {
  name: string

  isReadonly: boolean

  /**
   * required: true && !
   * required: false && ?
   */
  isRequired: boolean

  /**
   * Vue component property type - String | Number | Boolean | Object | ...
   */
  propType?: string

  /**
   * Typescript native type
   */
  nativeType: string

  /**
   * initialized value
   */
  defaultValue?: string

  /**
   * Validator
   */
  validator?: string
}

export function createProp(propertyDeclaration: PropertyDeclaration): Prop {
  const propStructure = propertyDeclaration.getStructure()

  const name = propStructure.name
  const isReadonly = !!propStructure.isReadonly
  const nativeType = (propStructure.type as string) ?? 'any'


  const prop: Prop = {
    // class property
    name, isReadonly, nativeType,
    // decorator properties
    isRequired: false,
  }

  const [decorator] = propertyDeclaration.getChildrenOfKind(SyntaxKind.Decorator)
  const propertyAssignments = decorator.getCallExpression()
    ?.getChildrenOfKind(SyntaxKind.ObjectLiteralExpression)
    .flatMap(expression => expression.getChildrenOfKind(SyntaxKind.PropertyAssignment))

  propertyAssignments?.forEach(pa => {
    switch (getPropertyIdentifier(pa)) {
      case 'type':
        prop.propType = getPropertyInitializer(pa)
        break
      case 'default':
        prop.defaultValue = getPropertyInitializer(pa)
        break
      case 'validator':
        prop.validator = getPropertyInitializer(pa)
        break
      case 'required':
        prop.isRequired = getPropertyInitializer(pa) === 'true' ? true : false
        break
    }
  })

  return prop
}

export function generateProp(prop: Prop, writer: CodeBlockWriter): CodeBlockWriter {
  return writer
    .write(`${prop.name}: `).inlineBlock(() => {
      prop.propType && writer.writeLine(`type: ${prop.propType} as PropType<${prop.nativeType}>,`)
      prop.isRequired && writer.writeLine(`required: ${prop.isRequired},`)
      prop.defaultValue && writer.writeLine(`default: ${prop.defaultValue},`)
      prop.validator && writer.writeLine(`validator: ${prop.validator},`)
    })
    .write(',').newLine()
}

function getPropertyIdentifier(propertyAssignment: PropertyAssignment): PropPropertyType {
  return propertyAssignment.getName() as PropPropertyType
}

function getPropertyInitializer(propertyAssignment: PropertyAssignment): string {
  return propertyAssignment.getInitializer()!.getText()
}


