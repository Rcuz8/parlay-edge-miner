import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/setup-env.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.base.json', isolatedModules: true }]
  },
  moduleNameMapper: {
    '^@odd/(.*)$': '<rootDir>/packages/odds-client/src/$1',
    '^@stats/(.*)$': '<rootDir>/packages/mlb-stats/src/$1',
    '^@llm/(.*)$': '<rootDir>/packages/llm-prob/src/$1',
    '^@engine/(.*)$': '<rootDir>/packages/parlay-engine/src/$1',
    '^@config/(.*)$': '<rootDir>/packages/common-config/src/$1'
  },
  extensionsToTreatAsEsm: ['.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['packages/**/src/**/*.ts'],
  coverageThreshold: {
    global: { branches: 80, functions: 80, statements: 80, lines: 80 },
    'packages/parlay-engine/src/**/*.ts': {
      branches: 90,
      functions: 90,
      statements: 90,
      lines: 90,
    },
  },
};

export default config;