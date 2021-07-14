const path = require('path');
const { declare } = require('@babel/helper-plugin-utils');

// Default options for babel preset
const defaultOptions = {
  alias: false,
  antd: false,
  corejs: false,
  debug: false,
  mui: false,
  node: false,
  react: false,
  transformRuntime: true,
  typescript: false,
  useESModules: false,
};

// Default options for @babel/preset-env
const defaultOptionsForPresetEnv = {
  bugfixes: true,
  spec: false,
  loose: true,
  modules: 'auto',
  debug: false,
  include: [],
  exclude: [
    'transform-async-to-generator',
    'transform-literals',
    'transform-modules-amd',
    'transform-modules-systemjs',
    'transform-modules-umd',
    'transform-new-target',
    'transform-regenerator',
    'transform-sticky-regex',
    'transform-template-literals',
    'transform-typeof-symbol',
    'transform-unicode-regex',
  ],
  useBuiltIns: false,
  corejs: false,
  forceAllTransforms: false,
  ignoreBrowserslistConfig: false,
  shippedProposals: false,
};

module.exports = declare((api, options = defaultOptions) => {
  const env = process.env.BABEL_ENV ?? process.env.NODE_ENV ?? 'production';
  const isDev = env === 'development';
  const {
    alias,
    antd,
    corejs,
    debug,
    mui,
    node,
    react,
    targets,
    transformRuntime,
    typescript,
    useESModules,
  } = options;

  api.assertVersion('^7.13.0');
  api.cache.using(() => isDev);

  if (targets) {
    defaultOptionsForPresetEnv.targets = targets;
  }

  if (node) {
    defaultOptionsForPresetEnv.ignoreBrowserslistConfig = true;
    defaultOptionsForPresetEnv.targets = {
      node: 'current',
    };
  }

  if (debug) {
    defaultOptionsForPresetEnv.debug = debug;
  }

  if (corejs) {
    defaultOptionsForPresetEnv.corejs = corejs;
  }

  if (useESModules) {
    defaultOptionsForPresetEnv.modules = false;
  }

  defaultOptionsForPresetEnv.browserslistEnv = env;

  // Initial babel presets
  const presets = [[require('@babel/preset-env').default, defaultOptionsForPresetEnv]];

  // Initial babel plugins
  const plugins = [
    [require('@babel/plugin-proposal-decorators').default, { legacy: true }],
    [require('@babel/plugin-proposal-class-properties').default, { loose: true }],
    [require('@babel/plugin-proposal-logical-assignment-operators').default, {}],
    [require('@babel/plugin-proposal-nullish-coalescing-operator').default, { loose: true }],
    [require('@babel/plugin-proposal-numeric-separator').default, {}],
    [require('@babel/plugin-proposal-optional-chaining').default, { loose: true }],
    [require('@babel/plugin-proposal-private-methods').default, { loose: true }],
    [require('@babel/plugin-syntax-top-level-await').default, {}],
    [require('babel-plugin-macros'), {}],
    [
      require('babel-plugin-import').default,
      {
        libraryName: 'ahooks',
        libraryDirectory: 'es',
        camel2DashComponentName: false,
      },
      'ahooks',
    ],
    [
      require('babel-plugin-import').default,
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
    ],
  ];

  // Add react preset and plugins
  if (react) {
    presets.push([
      require('@babel/preset-react').default,
      {
        development: isDev,
        runtime: 'automatic',
      },
    ]);

    if (!isDev) {
      if (antd) {
        plugins.push([
          require('babel-plugin-import').default,
          {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true,
          },
          'antd',
        ]);
      }

      if (mui) {
        plugins.push(
          [
            require('babel-plugin-import').default,
            {
              libraryName: '@material-ui/core',
              libraryDirectory: 'esm',
              camel2DashComponentName: false,
            },
            'mui-core',
          ],
          [
            require('babel-plugin-import').default,
            {
              libraryName: '@material-ui/icons',
              libraryDirectory: 'esm',
              camel2DashComponentName: false,
            },
            'mui-icons',
          ],
          [
            require('babel-plugin-import').default,
            {
              libraryName: '@material-ui/lab',
              libraryDirectory: 'esm',
              camel2DashComponentName: false,
            },
            'mui-lab',
          ],
          [
            require('babel-plugin-import').default,
            {
              libraryName: '@material-ui/styles',
              libraryDirectory: 'esm',
              camel2DashComponentName: false,
            },
            'mui-styles',
          ],
          [
            require('babel-plugin-import').default,
            {
              libraryName: '@material-ui/system',
              libraryDirectory: 'esm',
              camel2DashComponentName: false,
            },
            'mui-system',
          ],
          [
            require('babel-plugin-import').default,
            {
              libraryName: '@material-ui/utils',
              libraryDirectory: 'esm',
              camel2DashComponentName: false,
            },
            'mui-utils',
          ],
          [
            require('babel-plugin-import').default,
            {
              libraryName: '@material-ui/pickers',
              libraryDirectory: 'esm',
              camel2DashComponentName: false,
            },
            'mui-pickers',
          ],
        );
      }

      plugins.push(
        [require('@babel/plugin-transform-react-constant-elements').default, {}],
        [require('@babel/plugin-transform-react-inline-elements').default, {}],
      );
    }
  }

  // Add typescript preset and plugins
  if (typescript) {
    presets.push([
      require('@babel/preset-typescript').default,
      {
        isTSX: react,
        allExtensions: react,
        allowNamespaces: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
      },
    ]);
  }

  // Add transform runtime plugin
  if (transformRuntime) {
    plugins.push([
      require('@babel/plugin-transform-runtime').default,
      {
        corejs,
        helpers: true,
        regenerator: true,
        useESModules,
        absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json')),
        version: require('@babel/runtime/package.json').version,
      },
    ]);
  }

  // Support path alias with babel
  if (alias) {
    plugins.push([
      require('babel-plugin-module-resolver').default,
      {
        root: ['.'],
        alias: {
          '@/app': './src/app.ts',
          '@/assets': './src/assets',
          '@/components': './src/components',
          '@/configs': './src/configs',
          '@/constants': './src/constants',
          '@/helpers': './src/helpers',
          '@/interfaces': './src/interfaces',
          '@/layouts': './src/layouts',
          '@/locales': './src/locales',
          '@/models': './src/models',
          '@/pages': './src/pages',
          '@/plugins': './src/plugins',
          '@/routes': './src/routes',
          '@/schema': './src/schema',
          '@/schemas': './src/schemas',
          '@/services': './src/services',
          '@/server': './src/server.ts',
          '@/types': './src/types',
          '@/utils': './src/utils',
        },
      },
    ]);
  }

  return {
    presets,
    plugins,
    sourceMaps: isDev ? 'inline' : true,
  };
});
