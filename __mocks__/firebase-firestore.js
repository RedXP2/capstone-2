export const collection = jest.fn(() => ({
  add: jest.fn(),
  doc: jest.fn(() => ({
    update: jest.fn(),
    delete: jest.fn(),
  })),
  where: jest.fn(() => ({
    orderBy: jest.fn(() => ({
      onSnapshot: jest.fn(),
    })),
  })),
}));

export const addDoc = jest.fn();
export const updateDoc = jest.fn();
export const deleteDoc = jest.fn();
export const doc = jest.fn();
export const query = jest.fn();
export const where = jest.fn();
export const orderBy = jest.fn();
export const onSnapshot = jest.fn();
