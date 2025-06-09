module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testMatch: [
    '**/__tests__/**/*.test.{js,jsx}',
    '**/?(*.)+(spec|test).{js,jsx}'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^firebase/auth$': '<rootDir>/__mocks__/firebase-auth.js',
    '^firebase/firestore$': '<rootDir>/__mocks__/firebase-firestore.js',
    '^firebase/app$': '<rootDir>/__mocks__/firebase-app.js',
    '^firebase/compat/app$': '<rootDir>/__mocks__/firebase-compat.js',
    '^firebase/compat/auth$': '<rootDir>/__mocks__/firebase-compat.js',
    '^firebase/compat/firestore$': '<rootDir>/__mocks__/firebase-compat.js',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js',
    '!**/jest.config.js',
    '!**/*.helper.js'
  ],
};
