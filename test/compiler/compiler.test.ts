import { SFCBlock, SFCDescriptor } from 'vue-sfc-parser'
import { TEST_CLASS_COMPONENT_CODE, TEST_OPTIONS_COMPONENT_CODE } from '../data'
import { compile } from '../../src/compiler'
import { buildLinter } from '../../src/compiler/linter'

describe('Compiler', () => {

  const buildTestDescriptor = (scriptContent: string = TEST_CLASS_COMPONENT_CODE): SFCDescriptor => ({
    template: null,
    script: new SFCBlock({
      type: 'script',
      content: scriptContent,
      attrs: {},
      start: 0,
      end: 10,
      lang: 'ts',
    }),
    styles: [],
    customBlocks: [],
  })

  const linter = buildLinter('vue/.eslintrc.js')

  it('Should compile test component script to object API', async () => {
    const classDescriptor = buildTestDescriptor()
    const optionsDescriptor = await compile(classDescriptor, { linter })

    expect(optionsDescriptor.script?.content).toEqual(TEST_OPTIONS_COMPONENT_CODE)
  })

  it('Should not change original descriptor template, styles or custom blocks', async () => {
    const classDescriptor = buildTestDescriptor()
    const optionsDescriptor = await compile(classDescriptor, { linter })

    expect(optionsDescriptor.template).toEqual(classDescriptor.template)
    expect(optionsDescriptor.styles).toEqual(classDescriptor.styles)
    expect(optionsDescriptor.customBlocks).toEqual(classDescriptor.customBlocks)
    expect(optionsDescriptor.script?.content).not.toEqual(classDescriptor.script?.content)
  })

  it('Should throw error if script tag not found', async () => {
    const classDescriptor = buildTestDescriptor()
    classDescriptor.script = null
    await expect(compile(classDescriptor, { linter }))
      .rejects
      .toThrowError('No script tag found')
    
  })

  it('Should throw error if no class found', async () => {
    await expect(compile(buildTestDescriptor(''), { linter }))
      .rejects
      .toThrowError('No class found')
  })

})
