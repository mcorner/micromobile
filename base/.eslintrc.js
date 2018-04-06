module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "indent": ["warn", 2],
    "linebreak-style": ["error", "unix"],
    "semi": ["error", "always"],
    "quotes": "off",
    "no-console": "off",
    "camelcase": ["warn", {properties: "always"}],
    "no-unused-vars": "off",
  },
  "globals":{
    "MicroMobile": true,
    "PushNotification": true,
    "mraid": true,
    "Branch": true,
    "device": true,
  },
  "plugins": [
    "react"
  ]
};
