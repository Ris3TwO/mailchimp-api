import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.module.ts',
    '!**/main.ts',
    '!**/*.interface.ts',
    '!**/*.dto.ts',
    '!**/interfaces/**',
    '!**/__mocks__/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['mailchimp/interfaces/index.ts'],
};

export default config;
