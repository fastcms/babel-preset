/**
 * @type {import("@babel/core").TransformOptions}
 */
module.exports = {
  ignore: ['**/*.d.ts'],
  presets: [
    [
      './index.js',
      {
        node: true,
        typescript: true,
      },
    ],
  ],
};
