module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
      "standard",
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint", "react"],
    "parserOptions": {
      "project": "tsconfig.json",
      "tsconfigRootDir": __dirname,
      "sourceType": "module"
    },
    "rules": {
      "semi": ["error", "always"]
    }
}
