export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/tests/**'
  ]
};