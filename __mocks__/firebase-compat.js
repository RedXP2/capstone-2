const mockAuth = {
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test', email: 'test@example.com' } })),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test', email: 'test@example.com' } })),
  signOut: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn(),
};

const mockFirestore = {
  collection: jest.fn(() => ({
    add: jest.fn(() => Promise.resolve({ id: 'test-id' })),
    doc: jest.fn(() => ({
      set: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
      delete: jest.fn(() => Promise.resolve()),
      get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({}) })),
    })),
    where: jest.fn(() => ({
      orderBy: jest.fn(() => ({
        onSnapshot: jest.fn(),
        get: jest.fn(() => Promise.resolve({ docs: [] })),
      })),
    })),
    orderBy: jest.fn(() => ({
      onSnapshot: jest.fn(),
      get: jest.fn(() => Promise.resolve({ docs: [] })),
    })),
    onSnapshot: jest.fn(),
    get: jest.fn(() => Promise.resolve({ docs: [] })),
  })),
};

const mockFirebase = {
  apps: [],
  initializeApp: jest.fn(),
  auth: jest.fn(() => mockAuth),
  firestore: jest.fn(() => mockFirestore),
};

export default mockFirebase;
