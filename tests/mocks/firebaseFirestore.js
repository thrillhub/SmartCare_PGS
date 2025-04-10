// tests/__mocks__/firebaseFirestore.js
module.exports = {
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(() => Promise.resolve())
      }))
    }))
  }))
};