// ============================================
// Shopping List App - Main Entry Point
// ============================================
// This is the main orchestrator that imports and wires together
// all the modular components of the shopping list application.

import "./index.css";

import { DOM } from "./modules/dom.js";
import { setupEventListeners } from "./modules/events.js";

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
