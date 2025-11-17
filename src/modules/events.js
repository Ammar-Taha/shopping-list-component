// ============================================
// Event Listeners Setup
// ============================================

import { DOM } from "./dom.js";
import { deleteItem, addItem, editItem, toggleItemCompleted, clearAllItems, updateItemQuantity, reorderItems } from "./items.js";
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

    // Check if the clicked element is a quantity increase button
    const increaseBtn = event.target.closest(".shopping-app__quantity-btn--increase");
    if (increaseBtn) {
      const quantityInput = listItem.querySelector(".shopping-app__quantity-input");
      if (quantityInput) {
        const currentQuantity = parseInt(quantityInput.value, 10) || 1;
        updateItemQuantity(listItem, currentQuantity + 1);
      }
      return;
    }

    // Check if the clicked element is a quantity decrease button
    const decreaseBtn = event.target.closest(".shopping-app__quantity-btn--decrease");
    if (decreaseBtn) {
      const quantityInput = listItem.querySelector(".shopping-app__quantity-input");
      if (quantityInput) {
        const currentQuantity = parseInt(quantityInput.value, 10) || 1;
        if (currentQuantity > 1) {
          updateItemQuantity(listItem, currentQuantity - 1);
        }
      }
      return;
    }
  });

  // Handle quantity input changes (for direct input)
  DOM.listElement.addEventListener("input", (event) => {
    const quantityInput = event.target.closest(".shopping-app__quantity-input");
    if (quantityInput) {
      const listItem = quantityInput.closest(".shopping-app__item");
      if (listItem) {
        const newQuantity = parseInt(quantityInput.value, 10) || 1;
        updateItemQuantity(listItem, newQuantity);
      }
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

  // Handle drag and drop for reordering items
  if (DOM.listElement) {
    let draggedItem = null;

    // Drag start
    DOM.listElement.addEventListener("dragstart", (event) => {
      const listItem = event.target.closest(".shopping-app__item");
      if (!listItem) return;
      
      // Don't start drag on interactive elements (buttons, inputs, checkboxes)
      const interactiveElements = ["button", "input", "label"];
      if (interactiveElements.includes(event.target.tagName.toLowerCase()) || 
          event.target.closest("button, input, label")) {
        event.preventDefault();
        return;
      }
      
      draggedItem = listItem;
      listItem.classList.add("shopping-app__item--dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/html", listItem.innerHTML);
    });

    // Drag end
    DOM.listElement.addEventListener("dragend", (event) => {
      const listItem = event.target.closest(".shopping-app__item");
      if (listItem) {
        listItem.classList.remove("shopping-app__item--dragging");
      }
      draggedItem = null;
    });

    // Drag over - allow drop
    DOM.listElement.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      
      const targetItem = event.target.closest(".shopping-app__item");
      if (targetItem && targetItem !== draggedItem) {
        // Add visual feedback
        const items = Array.from(DOM.listElement.querySelectorAll(".shopping-app__item"));
        const draggedIndex = items.indexOf(draggedItem);
        const targetIndex = items.indexOf(targetItem);
        
        // Remove previous drop indicator
        items.forEach(item => {
          item.classList.remove("shopping-app__item--drag-over");
        });
        
        // Add drop indicator to target
        if (draggedIndex < targetIndex) {
          targetItem.classList.add("shopping-app__item--drag-over");
        } else if (draggedIndex > targetIndex) {
          targetItem.classList.add("shopping-app__item--drag-over");
        }
      }
    });

    // Drag leave - remove visual feedback
    DOM.listElement.addEventListener("dragleave", (event) => {
      const targetItem = event.target.closest(".shopping-app__item");
      if (targetItem) {
        targetItem.classList.remove("shopping-app__item--drag-over");
      }
    });

    // Drop - reorder items
    DOM.listElement.addEventListener("drop", (event) => {
      event.preventDefault();
      
      const targetItem = event.target.closest(".shopping-app__item");
      if (!targetItem || !draggedItem || targetItem === draggedItem) {
        return;
      }

      // Remove all drag-over classes
      const items = Array.from(DOM.listElement.querySelectorAll(".shopping-app__item"));
      items.forEach(item => {
        item.classList.remove("shopping-app__item--drag-over");
      });

      // Reorder items
      reorderItems(draggedItem, targetItem);
    });
  }
}

