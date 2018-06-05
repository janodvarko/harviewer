module.exports = {
    "extends": "google",
    "root": true,
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

        // HAR Viewer uses double quotes.
        "quotes": ["error", 'double', { allowTemplateLiterals: false }],

        // HAR Viewer doesn't have complete JSDoc, so add docs as edits are made.
        "require-jsdoc": "warn",

        // Enforce curly braces around blocks
        "curly": "error",

        "space-before-function-paren": ["error", "never"],

        "max-len": ["error", 100],

        "object-curly-spacing": ["error", "always"],

        "yoda": "warn"
    },
};
