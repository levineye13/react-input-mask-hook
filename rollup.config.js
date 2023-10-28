import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

import packageJson from './package.json';

export default [
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
    input: './dist/types/index.d.ts',
    output: {
      file: packageJson.types,
      format: 'esm',
      plugins: [dts()],
    },
  },
];
