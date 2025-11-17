// ============================================
// Local Storage Management
// ============================================

const STORAGE_KEY = "shopping-list-items";

/**
 * Get all items from localStorage
 * @returns {Array<{name: string, completed: boolean}>} Array of item objects
 */
export function getStoredItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Handle migration from old format (array of strings)
    if (parsed.length > 0 && typeof parsed[0] === "string") {
      return parsed.map((name) => ({ name, completed: false }));
    }
    return parsed;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}

/**
 * Save items to localStorage
 * @param {Array<{name: string, completed: boolean}>} items - Array of item objects to save
 */
export function saveItemsToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    // Handle quota exceeded error
    if (error.name === "QuotaExceededError") {
      alert("Storage quota exceeded. Unable to save items.");
    }
  }
}

/**
 * Clear all items from localStorage
 */
export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}
