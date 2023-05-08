import { ESLint } from 'eslint'
import { getPathFromWorkingDirectory } from '../utils'

export function buildDefaultLinter(): ESLint {
  return new ESLint({
    useEslintrc: false,
    fix: true,
    fixTypes: ['problem', 'suggestion', 'layout'],
  })
}

export function buildLinter(configFilePath?: string): ESLint {
  return new ESLint({
    overrideConfigFile: configFilePath ? getPathFromWorkingDirectory(configFilePath) : undefined,
    fix: true, // auto fix always true
  })
}

// this explodes with CardFailure.vue
export async function lintCode(eslint: ESLint, code: string): Promise<string> {
  // lintText always returns only one LintResult
  // https://eslint.org/docs/latest/integrate/nodejs-api#-eslintlinttextcode-options
  const [lintedFile]: ESLint.LintResult[] = await eslint.lintText(code)

  const output = lintedFile.output ?? code

  return output.trimStart()
}

export async function lintFile(eslint: ESLint, filepath: string): Promise<void> {
  // lintFiles lints targets and returns de results
  // https://eslint.org/docs/latest/integrate/nodejs-api#-eslintlintfilespatterns
  const [lintedFile]: ESLint.LintResult[] = await eslint.lintFiles(getPathFromWorkingDirectory(filepath))
  if (!lintedFile) throw Error(`Failed to format file on ${filepath}`)
}