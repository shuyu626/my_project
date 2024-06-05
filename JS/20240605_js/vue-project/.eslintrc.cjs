/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:vue-pug/vue3-recommended',
    'eslint:recommended',
    '@vue/standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
  // 可自定義規則
  // rules: {
  //   'no-unused-vars': 'off'
  // }
}
