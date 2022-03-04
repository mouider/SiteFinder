// eslint-disable-next-line no-undef
module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testTimeout: 200000,
};