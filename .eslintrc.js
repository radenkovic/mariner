module.exports = {
  extends: ['airbnb-base',  'plugin:jest/recommended','prettier'],
  parser: 'babel-eslint',
  plugins: ['import', 'prettier', 'flowtype', 'jest'],
  settings: {
    "import/resolver": {
      "babel-module": {}
    }
  },
  globals: {
    "jest/globals": true
  },
  env: {
    node: true,
    jest: true
  },
  rules: {
    'no-console': 1,
    'no-param-reassign': 0,
    'prettier/prettier': ['error', {
      'singleQuote': true
    }],
    'import/prefer-default-export': 0
    // Additional, per-project rules...
  }
}
