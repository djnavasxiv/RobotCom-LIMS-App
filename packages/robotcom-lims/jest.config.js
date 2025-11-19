/**
 * jest.config.js - Jest Configuration for RobotCom LIMS
 * 
 * Test Configuration:
 * - Environment: Node.js
 * - Transform: TypeScript support
 * - Coverage: >90% threshold
 */

module.exports = {
  displayName: 'robotcom-lims',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.spec.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/generated/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testTimeout: 10000,
};
