// jest.config.js
module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageProvider: "babel",
  clearMocks: true,
  setupFiles: ["./jest.setup.js"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "^firebase/app$": "<rootDir>/tests/mocks/firebaseApp.js",
    "^firebase/auth$": "<rootDir>/tests/mocks/firebaseAuth.js",
    "^firebase/firestore$": "<rootDir>/tests/mocks/firebaseFirestore.js",
    "^firebase/storage$": "<rootDir>/tests/mocks/firebaseStorage.js",
    "^firebase-admin$": "<rootDir>/tests/mocks/firebase-admin.js"
  },
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@firebase|firebase)/)"
  ],
  moduleDirectories: ["node_modules", "<rootDir>"],
  modulePathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/node_modules/"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/build/"
  ],
  roots: ["<rootDir>"],
  verbose: true // Added for debugging
};