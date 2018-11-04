export default () => ({
  main: "dist/index.js",
  types: "dist/index.d.ts",
  files: ["dist"],
  scripts: {
    prebuild: "rm -rf dist",
    build: "tsc -p tsconfig-build.json",
    prepare: "npm run build",
    release: "standard-version",
    test: "jest"
  },
  jest: {
    preset: "ts-jest",
    testEnvironment: "node"
  },
  husky: {
    hooks: {
      "pre-commit": "npm test && pretty-quick --staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  keywords: ["typescript", "jest"],
  license: "MIT",
  devDependencies: {
    "@commitlint/cli": "^7.2.1",
    "@commitlint/config-conventional": "^7.1.2",
    "@types/jest": "^23.3.9",
    husky: "^1.1.2",
    jest: "^23.6.0",
    prettier: "^1.13.7",
    "pretty-quick": "^1.8.0",
    "standard-version": "^4.4.0",
    "ts-jest": "^23.10.4",
    typescript: "^3.1.6"
  }
});
