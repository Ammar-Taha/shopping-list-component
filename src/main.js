// ============================================
// Shopping List App - Main Entry Point
// ============================================
// This is the main orchestrator that imports and wires together
// all the modular components of the shopping list application.

import "./index.css";

import { DOM } from "./modules/dom.js";
import { setupEventListeners } from "./modules/events.js";
import { loadItemsFromStorage } from "./modules/items.js";
import { applyFilter, toggleFilterButtons, toggleEmptyState } from "./modules/utils.js";
import { toggleListVisibility } from "./modules/visibility.js";

// ============================================
// Initialization
// ============================================

function initShoppingList() {
  // Validate required DOM elements
  if (
    !DOM.listElement ||
    !DOM.itemCountOutput ||
    !DOM.itemsLabel ||
    !DOM.addForm ||
    !DOM.itemInput
  ) {
    console.warn("Shopping list elements not found");
    return;
  }

  // Ensure hide list checkbox is unchecked on page load
  if (DOM.hideListCheckbox) {
    DOM.hideListCheckbox.checked = false;
    // Also ensure the list is visible (in case it was hidden)
    toggleListVisibility(false);
  }

  // Load items from localStorage
  loadItemsFromStorage();

  // Apply initial filter state
  applyFilter();

  // Toggle filter buttons visibility based on item count
  toggleFilterButtons();

  // Toggle empty state visibility based on item count
  toggleEmptyState();

  // Setup all event listeners
  setupEventListeners();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShoppingList);
} else {
  // DOM is already ready
  initShoppingList();
}
