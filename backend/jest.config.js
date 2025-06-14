/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/tests/**/*.test.ts"
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    // Support for absolute imports if needed
    '^@/(.*)$': '<rootDir>/$1',
  },
};
