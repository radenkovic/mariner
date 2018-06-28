module.exports = {
  extends: ['airbnb-base',  "plugin:jest/recommended",'prettier'],
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
    'camelcase': 0,
    'new-cap': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    'no-param-reassign': 0,
    'prettier/prettier': ['error', {
      'singleQuote': true
    }]
    // Additional, per-project rules...
  }
}
