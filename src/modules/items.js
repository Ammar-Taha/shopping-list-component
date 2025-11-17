// ============================================
// Item Operations
// ============================================

import { DOM } from "./dom.js";
import { updateItemCount, applyFilter, toggleFilterButtons, toggleEmptyState } from "./utils.js";
import { saveItemsToStorage, getStoredItems } from "./storage.js";
import { toggleListVisibility } from "./visibility.js";

/**
 * Helper function to ensure hide list checkbox is unchecked and list is visible
 */
function ensureListVisible() {
  if (DOM.hideListCheckbox && DOM.hideListCheckbox.checked) {
    DOM.hideListCheckbox.checked = false;
    toggleListVisibility(false);
  }
}

export function createListItem(itemName, completed = false) {
  // Create list item element
  const listItem = document.createElement("li");
  listItem.className = "shopping-app__item";
  if (completed) {
    listItem.classList.add("shopping-app__item--completed");
  }

  // Create checkbox for completion
  const checkboxLabel = document.createElement("label");
  checkboxLabel.className = "shopping-app__item-checkbox-label";
  
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "shopping-app__item-checkbox";
  checkbox.checked = completed;
  checkbox.setAttribute("aria-label", `Mark ${itemName} as ${completed ? "active" : "completed"}`);

  checkboxLabel.appendChild(checkbox);

  // Create item name span
  const itemNameSpan = document.createElement("span");
  itemNameSpan.className = "shopping-app__item-name";
  itemNameSpan.textContent = itemName;

  // Create actions container
  const actionsContainer = document.createElement("div");
  actionsContainer.className = "shopping-app__item-actions";

  // Create edit button (small tag button)
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "shopping-app__item-edit";
  editButton.setAttribute("aria-label", `Edit ${itemName}`);
  editButton.textContent = "Edit";
  if (completed) {
    editButton.disabled = true;
  }

  // Create delete button (small tag button)
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "shopping-app__item-delete";
  deleteButton.setAttribute("aria-label", `Remove ${itemName}`);
  deleteButton.textContent = "Delete";

  // Assemble actions
  actionsContainer.appendChild(editButton);
  actionsContainer.appendChild(deleteButton);

  // Assemble the list item
  listItem.appendChild(checkboxLabel);
  listItem.appendChild(itemNameSpan);
  listItem.appendChild(actionsContainer);

  return listItem;
}

export function addItem(itemName) {
  if (!itemName || !itemName.trim()) {
    return; // Don't add empty items
  }

  // Create new list item
  const listItem = createListItem(itemName.trim());

  // Add to the list
  DOM.listElement.appendChild(listItem);

  // Save to localStorage
  saveItemsList();

  // Update the item count
  updateItemCount();

  // Uncheck hide list checkbox and ensure list is visible
  ensureListVisible();

  // Hide the empty state illustration when an item is added
  const emptyStateIllustration = document.querySelector(
    ".shopping-app__empty-state-illustration"
  );
  if (emptyStateIllustration) {
    emptyStateIllustration.style.display = "none";
  }

  // Show the empty state button again if it was hidden
  const emptyStateButton = document.querySelector(
    ".shopping-app__empty-state-button"
  );
  if (emptyStateButton) {
    emptyStateButton.style.display = "flex";
  }

  // Clear the input
  DOM.itemInput.value = "";
  DOM.itemInput.focus();
}

export function toggleItemCompleted(listItem) {
  if (!listItem) {
    return;
  }

  const checkbox = listItem.querySelector(".shopping-app__item-checkbox");
  if (!checkbox) {
    return;
  }

  const isCompleted = checkbox.checked;
  
  // Toggle the completed class
  if (isCompleted) {
    listItem.classList.add("shopping-app__item--completed");
  } else {
    listItem.classList.remove("shopping-app__item--completed");
  }

  // Enable/disable edit button based on completion state
  const editButton = listItem.querySelector(".shopping-app__item-edit");
  if (editButton) {
    editButton.disabled = isCompleted;
  }

  // Update aria-label
  const itemName = listItem.querySelector(".shopping-app__item-name")?.textContent || "";
  checkbox.setAttribute("aria-label", `Mark ${itemName} as ${isCompleted ? "active" : "completed"}`);

  // Save to localStorage
  saveItemsList();

  // Update the item count and apply filter
  updateItemCount();
  applyFilter();
}

export function deleteItem(listItem) {
  if (!listItem) {
    return; // Safety check
  }

  // Remove the list item
  listItem.remove();

  // Save to localStorage
  saveItemsList();

  // Update the item count (which also toggles filter buttons)
  updateItemCount();
}

export function editItem(listItem) {
  if (!listItem) {
    return; // Safety check
  }

  const itemNameElement = listItem.querySelector(".shopping-app__item-name");
  if (!itemNameElement) {
    return;
  }

  const currentName = itemNameElement.textContent.trim();
  
  // Create input field
  const input = document.createElement("input");
  input.type = "text";
  input.className = "shopping-app__item-edit-input";
  input.value = currentName;
  input.setAttribute("aria-label", "Edit item name");

  // Replace span with input
  const parent = itemNameElement.parentNode;
  parent.replaceChild(input, itemNameElement);

  // Focus and select text
  input.focus();
  input.select();

  // Save on Enter or blur
  const saveEdit = () => {
    const newName = input.value.trim();
    if (newName && newName !== currentName) {
      // Create new span with updated name
      const newSpan = document.createElement("span");
      newSpan.className = "shopping-app__item-name";
      newSpan.textContent = newName;

      // Update delete button aria-label
      const deleteButton = listItem.querySelector(".shopping-app__item-delete");
      if (deleteButton) {
        deleteButton.setAttribute("aria-label", `Remove ${newName}`);
      }

      // Update edit button aria-label
      const editButton = listItem.querySelector(".shopping-app__item-edit");
      if (editButton) {
        editButton.setAttribute("aria-label", `Edit ${newName}`);
      }

      parent.replaceChild(newSpan, input);

      // Save to localStorage
      saveItemsList();
      // Ensure list is visible when item is edited
      ensureListVisible();
    } else if (newName === "") {
      // If empty, restore original or delete item
      const newSpan = document.createElement("span");
      newSpan.className = "shopping-app__item-name";
      newSpan.textContent = currentName;
      parent.replaceChild(newSpan, input);
    } else {
      // No change, just restore
      const newSpan = document.createElement("span");
      newSpan.className = "shopping-app__item-name";
      newSpan.textContent = currentName;
      parent.replaceChild(newSpan, input);
    }
  };

  // Cancel on Escape
  const cancelEdit = () => {
    const newSpan = document.createElement("span");
    newSpan.className = "shopping-app__item-name";
    newSpan.textContent = currentName;
    parent.replaceChild(newSpan, input);
  };

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      input.blur(); // Triggers saveEdit
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  });
}

/**
 * Get all current items from the DOM with their completed state
 * @returns {Array<{name: string, completed: boolean}>} Array of item objects
 */
function getCurrentItems() {
  const items = DOM.listElement.querySelectorAll(".shopping-app__item");
  return Array.from(items)
    .map((item) => {
      const nameElement = item.querySelector(".shopping-app__item-name");
      const checkbox = item.querySelector(".shopping-app__item-checkbox");
      const name = nameElement ? nameElement.textContent.trim() : "";
      const completed = checkbox ? checkbox.checked : false;
      return { name, completed };
    })
    .filter((item) => item.name !== "");
}

/**
 * Save current items list to localStorage
 */
function saveItemsList() {
  const items = getCurrentItems();
  saveItemsToStorage(items);
}

/**
 * Get initial items from HTML if they exist
 * @returns {Array<{name: string, completed: boolean}>} Array of item objects from HTML
 */
function getInitialItemsFromHTML() {
  const items = DOM.listElement.querySelectorAll(".shopping-app__item");
  return Array.from(items)
    .map((item) => {
      const nameElement = item.querySelector(".shopping-app__item-name");
      const name = nameElement ? nameElement.textContent.trim() : "";
      return { name, completed: false };
    })
    .filter((item) => item.name !== "");
}

// Store for confirmation state
let clearAllConfirmationPending = false;

/**
 * Clear all items from the list
 * Shows toast notifications for confirmation and success
 */
export function clearAllItems() {
  if (!DOM.listElement) {
    return;
  }

  // Initialize Notyf
  if (typeof Notyf === "undefined") {
    console.error("Notyf library not loaded");
    // Fallback to confirm if Notyf is not available
    const confirmed = confirm("Are you sure you want to clear all items?");
    if (!confirmed) return;
    
    // Clear items
    DOM.listElement.innerHTML = "";
    saveItemsToStorage([]);
    updateItemCount();
    applyFilter();
    return;
  }

  // Create Notyf instance with custom configuration
  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "right",
      y: "top",
    },
    types: [
      {
        type: "warning",
        background: "#090c26", // Same dark color as active filter buttons
        icon: {
          className: "notyf__icon--warning",
          tagName: "span",
        },
        className: "notyf__toast--warning",
      },
      {
        type: "success",
        background: "#4480c4", // Same blue shade as edit button/accent
      },
    ],
  });

  // Get current item count
  const itemCount = DOM.listElement.querySelectorAll(".shopping-app__item").length;

  // Don't show confirmation if list is already empty
  if (itemCount === 0) {
    notyf.open({
      type: "warning",
      message: "Your list is already empty!",
      duration: 3000,
    });
    return;
  }

  // If confirmation is pending, proceed with clearing
  if (clearAllConfirmationPending) {
    // Clear all items from DOM
    DOM.listElement.innerHTML = "";

    // Clear localStorage
    saveItemsToStorage([]);

    // Update the item count
    updateItemCount();

    // Apply filter (in case we're filtering)
    applyFilter();

    // Reset confirmation state
    clearAllConfirmationPending = false;

    // Show success toast
    notyf.success({
      message: `All ${itemCount} item${itemCount === 1 ? "" : "s"} cleared successfully!`,
      duration: 3000,
    });
    return;
  }

  // Show confirmation toast
  clearAllConfirmationPending = true;
  notyf.open({
    type: "warning",
    message: `Click "Clear All" again to confirm clearing ${itemCount} item${itemCount === 1 ? "" : "s"}`,
    duration: 5000,
  });

  // Reset confirmation state after timeout
  setTimeout(() => {
    clearAllConfirmationPending = false;
  }, 5000);
}

/**
 * Load items from localStorage and render them
 * If localStorage is empty, pre-populate with items from HTML
 */
export function loadItemsFromStorage() {
  let storedItems = getStoredItems();

  // If localStorage is empty, get items from HTML and save them
  if (storedItems.length === 0) {
    const htmlItems = getInitialItemsFromHTML();
    if (htmlItems.length > 0) {
      storedItems = htmlItems;
      saveItemsToStorage(storedItems);
    } else {
      return; // No items in HTML either
    }
  }

  // Clear existing items (if any)
  DOM.listElement.innerHTML = "";

  // Create and append each stored item
  storedItems.forEach((item) => {
    // Handle migration from old format (string)
    const itemName = typeof item === "string" ? item : item.name;
    const completed = typeof item === "string" ? false : item.completed;
    
    if (itemName && itemName.trim()) {
      const listItem = createListItem(itemName.trim(), completed);
      DOM.listElement.appendChild(listItem);
    }
  });

  // Update the item count (which also toggles filter buttons)
  updateItemCount();

  // If items were loaded, ensure list is visible
  if (storedItems.length > 0) {
    ensureListVisible();
  }
}
