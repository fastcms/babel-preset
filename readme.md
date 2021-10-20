# babel-preset

![NPM Package Version](https://img.shields.io/npm/v/@fastcms/babel-preset) ![Peer Babel Core Version](https://img.shields.io/npm/dependency-version/@fastcms/babel-preset/peer/@babel/core) ![Node.js Version](https://img.shields.io/node/v/@fastcms/babel-preset) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) ![NPM Weekly Downloads](https://img.shields.io/npm/dw/@fastcms/babel-preset) ![GitHub CI Workflow](https://github.com/fastcms/babel-preset/actions/workflows/main.yml/badge.svg)

> Shared @babel preset for web development projects of @fastcms.

This shared babel preset can be used for transpiling modern JavaScript projects, it can also be used for React or TypeScript projects.

## Installation

Use npx to install peerdeps automatically or install peerDependencies and optionalDependencies with npm/yarn manually.

```bash
# Install using npm
$ npm info "@fastcms/babel-preset" peerDependencies optionalDependencies
$ npx install-peerdeps --dev @fastcms/babel-preset

# Install using yarn
$ yarn add --dev @fastcms/babel-preset
$ yarn add --dev @babel/core @babel/runtime core-js
```

## Usage

After installation, add following contents to your `.babelrc` or `babel.config.js` file.

```js
module.exports = {
  ignore: ['**/*.d.ts'],
  presets: [
    [
      '@fastcms',
      {
        react: true,
        typescript: true,

        // antd: true,
        mui: true,

        alias: {
          '@/components': './src/components',
          '@/pages': './src/pages',
        },
      },
    ],
  ],
};
```

The babel config example above is used for transpiling a React and TypeScript stack project, this project is using [material-ui](https://mui.com/) as an UI framework (you can use [ant-design](https://ant.design/) instead), and this project using path alias for shortening import paths.

## License

The codebase and documentation in this repository are released under the [MIT License](./license)
