// ============================================
// Event Listeners Setup
// ============================================

import { DOM } from "./dom.js";
import { deleteItem, addItem, editItem, toggleItemCompleted, clearAllItems } from "./items.js";
import { toggleListVisibility } from "./visibility.js";
import { filterItems } from "./filter.js";
import { setFilter, applyFilter } from "./utils.js";

export function setupEventListeners() {
  // Event delegation: listen for clicks on the UL element for item buttons
  DOM.listElement.addEventListener("click", (event) => {
    // Find the parent list item
    const listItem = event.target.closest(".shopping-app__item");
    if (!listItem) {
      return;
    }

    // Check if the clicked element is a checkbox
    const checkbox = event.target.closest(".shopping-app__item-checkbox");
    if (checkbox) {
      // Toggle completion state
      toggleItemCompleted(listItem);
      return;
    }

    // Check if the clicked element is a delete button
    const deleteButton = event.target.closest(".shopping-app__item-delete");
    if (deleteButton) {
      // Delete the item (handles removal and count update)
      deleteItem(listItem);
      return;
    }

    // Check if the clicked element is an edit button
    const editButton = event.target.closest(".shopping-app__item-edit");
    if (editButton) {
      // Edit the item
      editItem(listItem);
      return;
    }
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

  // Handle filter buttons
  if (DOM.filterAll) {
    DOM.filterAll.addEventListener("click", () => setFilter("all"));
  }
  if (DOM.filterActive) {
    DOM.filterActive.addEventListener("click", () => setFilter("active"));
  }
  if (DOM.filterCompleted) {
    DOM.filterCompleted.addEventListener("click", () => setFilter("completed"));
  }

  // Handle clear all button
  if (DOM.clearAllButton) {
    DOM.clearAllButton.addEventListener("click", clearAllItems);
  }

  // Handle empty state button click
  if (DOM.emptyStateButton) {
    DOM.emptyStateButton.addEventListener("click", () => {
      // Hide empty state button
      if (DOM.emptyStateButton) {
        DOM.emptyStateButton.style.display = "none";
      }

      // Add class to trigger blue focus style
      if (DOM.itemInput) {
        DOM.itemInput.classList.add("focus-from-empty-state");
        DOM.itemInput.focus();

        // Remove class after focus is lost to restore original style
        DOM.itemInput.addEventListener(
          "blur",
          () => {
            DOM.itemInput.classList.remove("focus-from-empty-state");
          },
          { once: true }
        );
      }

      // Show the SVG illustration at the end (after hiding the button)
      const emptyStateIllustration = document.querySelector(
        ".shopping-app__empty-state-illustration"
      );
      if (emptyStateIllustration) {
        emptyStateIllustration.style.display = "block";
      }
    });
  }
}

