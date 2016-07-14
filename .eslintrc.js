module.exports = {
    "extends": "google",
    //"extends": "eslint:recommended",
    "installedESLint": true,
    "rules": {
        "linebreak-style": "off",
        "indent": ["warn", 4],
        "quote-props": "warn",
        "valid-jsdoc": "warn",
        "brace-style": "warn",
        "key-spacing": "warn",
        "spaced-comment": "warn",
        "space-infix-ops": "warn",
        "comma-spacing": "warn",
        "semi-spacing": "warn",
        "object-curly-spacing": "warn",
        "padded-blocks": "warn",
        "no-multi-spaces": "warn",
        "space-before-blocks": "warn",
        "space-unary-ops": "warn",
        "keyword-spacing": "warn",

        // Don't use reserved keywords for IE9 compatibility
        "dot-notation": [2, { "allowKeywords": false }],

        // Domplate uses function names starting with uppercase
        "new-cap": "warn",

        "yoda": "warn"
    },
    "env": {
        "browser": true,
        "amd": true,
        "jquery": true
    }
};
