module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/recommended',
        '@vue/standard',
        '@vue/typescript',
    ],
    plugins: ['simple-import-sort', 'unused-imports', 'import'],
    rules: {
        'semi': ['error', 'never'],
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        'no-debugger': 'error',
        'arrow-parens': 0,
        'generator-star-spacing': 0,
        'indent': 'off',
        'quote-props': ['error', 'consistent'],
        'dot-notation': 'off',
        'prefer-const': 'error',
        'space-in-brackets': 'off',
        'no-var': 'error',
        'no-unused-vars': 'off',
        'no-use-before-define': 'off',
        'vue/no-template-shadow': 'off',
        'vue/require-default-prop': 'off',
        'vue/html-indent': ['error', 4, {
            'attribute': 1,
            'baseIndent': 1,
            'closeBracket': 0,
            'alignAttributesVertically': true,
            'ignores': [],
        }],
        'vue/html-closing-bracket-newline': ['error', {
            'singleline': 'never',
            'multiline': 'never',
        }],
        'vue/script-indent': ['error', 4, {
            'baseIndent': 1,
            'switchCase': 1,
            'ignores': [],
        }],
        '@typescript-eslint/no-useless-constructor': ['error'],
        '@typescript-eslint/indent': ['error', 4, {
            'SwitchCase': 1,
            'ignoreComments': true,
        }],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-parameter-properties': ['error'],
        '@typescript-eslint/type-annotation-spacing': ['error'],
        '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
        'simple-import-sort/imports': ['warn', {
            groups: [
                ['', '@*[^.]*', '.*.plugin', '.*.md'],
                ['.*.vue'],
            ],
        }],
        'unused-imports/no-unused-imports': 'error',
        'comma-dangle': ['warn', 'always-multiline'],
        '@typescript-eslint/comma-dangle': ['warn', 'always-multiline'],
        '@typescript-eslint/member-delimiter-style': ['warn', {
            'multiline': {
                'delimiter': 'none',
                'requireLast': true,
            },
            'singleline': {
                'delimiter': 'comma',
                'requireLast': false,
            },
        }],
        '@typescript-eslint/explicit-function-return-type': ['warn', {
            'allowExpressions': true,
        }],
    },
    parserOptions: {
        parser: '@typescript-eslint/parser',
    },
    overrides: [
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 'off',
            },
        },
        {
            files: ['*.vue'],
            rules: {
                '@typescript-eslint/indent': 'off',
            },
        },
    ],
}
