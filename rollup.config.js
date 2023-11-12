const typescript = require('@rollup/plugin-typescript');
const dts = require('rollup-plugin-dts');

const packageJson = require('./package.json');

module.exports = [
  {
    input: './src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'esm',
      },
      {
        file: packageJson.module,
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
    external: ['react'],
  },
  {
    input: './dist/esm/types/index.d.ts',
    output: [
      {
        file: packageJson.types,
        format: 'esm',
      },
    ],
    plugins: [dts.default()],
  },
];
