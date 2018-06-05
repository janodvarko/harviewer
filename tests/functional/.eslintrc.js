/*
The functional tests run on Node and can use more modern JS syntax.
*/
module.exports = {
  "rules": {
    "indent": ["warn", 2],
  },
  "parserOptions": {
    "ecmaVersion": 6
  },
  "env": {
    "amd": true,
    "jquery": true
  }
};
