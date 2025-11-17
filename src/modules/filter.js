// ============================================
// Search Filter Functionality
// ============================================

import { DOM } from "./dom.js";

export function filterItems() {
  if (!DOM.searchInput || !DOM.listElement) {
    return;
  }

  const query = DOM.searchInput.value.toLowerCase().trim();
  const items = DOM.listElement.querySelectorAll(".shopping-app__item");

  items.forEach((item) => {
    const text = item.textContent.toLowerCase();

    if (text.includes(query)) {
      item.style.display = ""; // show
    } else {
      item.style.display = "none"; // hide
    }
  });
}

