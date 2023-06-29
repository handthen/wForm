module.exports = {
    "root": true,
    "env": {
        "node": true,
        "es6": true,
        "browser": true
    },
    "extends": [
        // "standard",
        "eslint:recommended",
        // " plugin:vue/essential",
        "plugin:vue/vue3-essential",
    ],
    "plugins": [
        "vue"
    ],
    "parserOptions": {
        'ecmaVersion': 2020,
        "sourceType": "module"
    },
    "rules": {
        // "no-console":"error"
        "no-unused-vars": 0,
        'vue/multi-word-component-names': 0
    },
}