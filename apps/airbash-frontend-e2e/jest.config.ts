import nxPreset from '@nrwl/jest/preset';

const { testEnvironment, ...rest } = nxPreset;

module.exports = {
  ...rest,
  preset: 'jest-playwright-preset',
  displayName: 'airbash-frontend-e2e',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  testEnvironmentOptions: {
    'jest-playwright': {
      browsers: ['chromium'],
    },
  },
};
