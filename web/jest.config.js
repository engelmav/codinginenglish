module.exports = async () => {
  return {
    verbose: false,
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      roots: ["./src/", "<rootDir>/__tests__/"],
      "testRegex": [
        "/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$"
      ],
    }
  }
}