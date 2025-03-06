/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: "jsdom", 
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: "tsconfig.json",
      useESM: true
    }]
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", 
    "^@components/(.*)$": "<rootDir>/src/components/$1",
  },
  // setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], 
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};

export default config;
