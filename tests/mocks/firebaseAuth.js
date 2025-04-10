// tests/__mocks__/firebaseAuth.js
module.exports = {
  getAuth: jest.fn(() => ({
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: { uid: 'test-user-id' } })
    ),
    currentUser: {
      sendEmailVerification: jest.fn(() => Promise.resolve())
    }
  }))
};