import { Book } from "../types/book";

const STORAGE_KEY = "inventory_db";

/**
 * Load inventory from localStorage (JSON DB)
 */
export const loadInventory = (): Book[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load inventory", error);
    return [];
  }
};

/**
 * Save inventory to localStorage (JSON DB)
 */
export const saveInventory = (inventory: Book[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  } catch (error) {
    console.error("Failed to save inventory", error);
  }
};
