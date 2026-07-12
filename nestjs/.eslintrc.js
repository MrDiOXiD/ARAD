module.exports = {
root: true,
parser: '@typescript-eslint/parser',
parserOptions: {
project: 'tsconfig.json',
tsconfigRootDir: __dirname,
sourceType: 'module',
},
plugins: ['@typescript-eslint'],
extends: [
'plugin:@typescript-eslint/recommended',
'plugin/recommended'
],
env: {
node: true,
jest: true,
},
ignorePatterns: ['dist', 'node_modules'],
rules: {
'@typescript-eslint/no-explicit-any': 'off',
'@typescript-eslint/explicit-function-return-type': 'off',
'@typescript-eslint/explicit-module-boundary-types': 'off',

// Let Prettier handle formatting
'prettier/prettier': ['error'],

},
};
