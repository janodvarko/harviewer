module.exports = {
    "rules": {
        // Don't use reserved keywords for IE9 compatibility
        "dot-notation": ["error", { "allowKeywords": false }],

        // Domplate uses function names starting with uppercase
        "new-cap": "warn",

        // HAR Viewer supports non-ES6 browsers and does not transpile (yet),
        // so have to use var.
        "no-var": "off"
    },
    "env": {
        "browser": true,
        "amd": true,
        "jquery": true
    }
};
