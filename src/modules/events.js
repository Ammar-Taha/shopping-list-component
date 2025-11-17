// ============================================
// Event Listeners Setup
// ============================================

import { DOM } from "./dom.js";
import { deleteItem, addItem } from "./items.js";
import { toggleListVisibility } from "./visibility.js";
import { filterItems } from "./filter.js";

export function setupEventListeners() {
  // Event delegation: listen for clicks on the UL element for delete buttons
  DOM.listElement.addEventListener("click", (event) => {
    // Check if the clicked element is a delete button
    const deleteButton = event.target.closest(".shopping-app__item-delete");

    if (!deleteButton) {
      return; // Not a delete button, ignore
    }

    // Find the parent list item
    const listItem = deleteButton.closest(".shopping-app__item");

    // Delete the item (handles removal and count update)
    deleteItem(listItem);
  });

  // Handle form submission (add new item)
  DOM.addForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form from submitting

    // Get the input value
    const itemName = DOM.itemInput.value;

    // Add the item
    addItem(itemName);
  });

  // Handle hide list checkbox
  if (DOM.hideListCheckbox) {
    DOM.hideListCheckbox.addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      toggleListVisibility(isChecked);
    });
  }

  // Handle search input filtering
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener("input", filterItems);
  }
}

