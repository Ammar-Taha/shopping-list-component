// ============================================
// Visibility Toggle Functionality
// ============================================

import { DOM } from "./dom.js";

export function toggleListVisibility(isHidden) {
  if (!DOM.itemsSection) {
    return;
  }

  if (isHidden) {
    DOM.itemsSection.classList.add("shopping-app__items--hidden");
  } else {
    DOM.itemsSection.classList.remove("shopping-app__items--hidden");
  }
}

