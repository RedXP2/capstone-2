export const signInWithEmailAndPassword = jest.fn(() => Promise.resolve({ user: { uid: 'test', email: 'test@example.com' } }));
export const createUserWithEmailAndPassword = jest.fn(() => Promise.resolve({ user: { uid: 'test', email: 'test@example.com' } }));
export const signOut = jest.fn(() => Promise.resolve());
export const onAuthStateChanged = jest.fn();
