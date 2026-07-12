/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Tell Jest to understand our TS path alias
    },
    testMatch: ['**/tests/**/*.test.ts'],
    setupFiles: ['dotenv/config'],
};
