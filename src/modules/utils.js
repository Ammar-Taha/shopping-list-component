// ============================================
// Utility Functions
// ============================================

import { DOM } from "./dom.js";

export function updateItemCount() {
  // Count remaining items
  const remainingItems = DOM.listElement.querySelectorAll(
    ".shopping-app__item"
  ).length;

  // Update the count in the output element
  DOM.itemCountOutput.textContent = remainingItems;

  // Update the label text (singular vs plural)
  if (remainingItems === 1) {
    DOM.itemsLabel.textContent = " item";
  } else {
    DOM.itemsLabel.textContent = " items";
  }
}

