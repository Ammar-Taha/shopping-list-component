// ============================================
// Item Operations
// ============================================

import { DOM } from "./dom.js";
import { updateItemCount } from "./utils.js";

export function createListItem(itemName) {
  // Create list item element
  const listItem = document.createElement("li");
  listItem.className = "shopping-app__item";

  // Create item name span
  const itemNameSpan = document.createElement("span");
  itemNameSpan.className = "shopping-app__item-name";
  itemNameSpan.textContent = itemName;

  // Create delete button
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "shopping-app__item-delete";
  deleteButton.setAttribute("aria-label", `Remove ${itemName}`);

  const deleteIcon = document.createElement("span");
  deleteIcon.setAttribute("aria-hidden", "true");
  deleteIcon.textContent = "×";

  deleteButton.appendChild(deleteIcon);

  // Assemble the list item
  listItem.appendChild(itemNameSpan);
  listItem.appendChild(deleteButton);

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

  // Update the item count
  updateItemCount();

  // Clear the input
  DOM.itemInput.value = "";
  DOM.itemInput.focus();
}

export function deleteItem(listItem) {
  if (!listItem) {
    return; // Safety check
  }

  // Remove the list item
  listItem.remove();

  // Update the item count
  updateItemCount();
}

