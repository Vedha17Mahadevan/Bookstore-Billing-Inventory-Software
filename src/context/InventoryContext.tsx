import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Book } from '../types/book';

interface InventoryContextType {
  inventory: Book[];
  addBook: (book: Book) => Promise<void>;
  updateBook: (book: Book) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  reduceStock: (items: { id: string; quantity: number }[]) => Promise<void>;
  refreshInventory: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

const API_URL = 'http://localhost:3001/inventory';

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<Book[]>([]);

  // 🔹 Load inventory from db.json
  const refreshInventory = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setInventory(data);
  };

  useEffect(() => {
    refreshInventory();
  }, []);

  const addBook = async (book: Book) => {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    await refreshInventory();
  };

  const updateBook = async (book: Book) => {
    await fetch(`${API_URL}/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    await refreshInventory();
  };

  const deleteBook = async (id: string) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    await refreshInventory();
  };

  const reduceStock = async (
    items: { id: string; quantity: number }[]
  ) => {
    for (const item of items) {
      const book = inventory.find((b) => b.id === item.id);
      if (!book) continue;

      await fetch(`${API_URL}/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: Math.max(book.quantity - item.quantity, 0),
        }),
      });
    }

    await refreshInventory();
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        addBook,
        updateBook,
        deleteBook,
        reduceStock,
        refreshInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error(
      'useInventory must be used within an InventoryProvider'
    );
  }
  return context;
}
