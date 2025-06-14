/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/backend/tests/**/*.test.ts"
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>/backend/tests'],
  moduleNameMapper: {
    // Support for absolute imports if needed
    '^@/(.*)$': '<rootDir>/backend/$1',
  },
};
