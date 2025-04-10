// tests/__mocks__/firebaseConfig.js
const mockAuth = {
  createUserWithEmailAndPassword: jest.fn(() => 
    Promise.resolve({ user: { uid: 'test-user-id' } })
  ),
  currentUser: {
    sendEmailVerification: jest.fn(() => Promise.resolve())
  }
};

const mockFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(() => Promise.resolve())
    }))
  }))
};

const mockStorage = {};

// This is the key part - we need to mock the actual Firebase SDK
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApp: jest.fn(),
  getApps: jest.fn(() => [])
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => mockAuth)
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => mockFirestore)
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => mockStorage)
}));

module.exports = {
  auth: mockAuth,
  db: mockFirestore,
  storage: mockStorage
};