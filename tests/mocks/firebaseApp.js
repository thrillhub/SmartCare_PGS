// tests/__mocks__/firebaseApp.js
module.exports = {
  initializeApp: jest.fn(),
  getApp: jest.fn(),
  getApps: jest.fn(() => [])
};