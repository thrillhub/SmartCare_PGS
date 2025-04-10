// tests/__mocks__/firebase-admin.js
module.exports = {
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(() => Promise.resolve())
      })),
      where: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ empty: true }))
      }))
    }))
  })),
  apps: []
};