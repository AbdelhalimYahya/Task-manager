export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/test/**/*.test.js'],
  verbose: true,
  forceExit: true,
  testTimeout: 10000,
  transform: {}
};
