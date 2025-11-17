// ============================================
// Utility Functions
// ============================================

import { DOM } from "./dom.js";

let currentFilter = "all"; // "all", "active", "completed"

export function setFilter(filter) {
  currentFilter = filter;
  applyFilter();
  updateItemCount();
  updateFilterButtons();
}

function updateFilterButtons() {
  if (!DOM.filterAll || !DOM.filterActive || !DOM.filterCompleted) return;

  // Reset all buttons
  DOM.filterAll.classList.remove("shopping-app__filter-btn--active");
  DOM.filterAll.setAttribute("aria-pressed", "false");
  DOM.filterActive.classList.remove("shopping-app__filter-btn--active");
  DOM.filterActive.setAttribute("aria-pressed", "false");
  DOM.filterCompleted.classList.remove("shopping-app__filter-btn--active");
  DOM.filterCompleted.setAttribute("aria-pressed", "false");

  // Activate the current filter button
  if (currentFilter === "all") {
    DOM.filterAll.classList.add("shopping-app__filter-btn--active");
    DOM.filterAll.setAttribute("aria-pressed", "true");
  } else if (currentFilter === "active") {
    DOM.filterActive.classList.add("shopping-app__filter-btn--active");
    DOM.filterActive.setAttribute("aria-pressed", "true");
  } else if (currentFilter === "completed") {
    DOM.filterCompleted.classList.add("shopping-app__filter-btn--active");
    DOM.filterCompleted.setAttribute("aria-pressed", "true");
  }
}

export function getCurrentFilter() {
  return currentFilter;
}

/**
 * Get the current search query from the input field
 * @returns {string} The search query (lowercase, trimmed)
 */
function getSearchQuery() {
  if (!DOM.searchInput) {
    return "";
  }
  return DOM.searchInput.value.toLowerCase().trim();
}

export function applyFilter() {
  if (!DOM.listElement) return;

  const items = DOM.listElement.querySelectorAll(".shopping-app__item");
  const searchQuery = getSearchQuery();
  let visibleCount = 0;

  items.forEach((item) => {
    const checkbox = item.querySelector(".shopping-app__item-checkbox");
    const isCompleted = checkbox ? checkbox.checked : false;

    // First check completion status filter
    let shouldShowByCompletion = false;
    if (currentFilter === "all") {
      shouldShowByCompletion = true;
    } else if (currentFilter === "active") {
      shouldShowByCompletion = !isCompleted;
    } else if (currentFilter === "completed") {
      shouldShowByCompletion = isCompleted;
    }

    // Then check search query filter
    let shouldShowBySearch = true;
    if (searchQuery) {
      const text = item.textContent.toLowerCase();
      shouldShowBySearch = text.includes(searchQuery);
    }

    // Item is visible only if it passes both filters
    if (shouldShowByCompletion && shouldShowBySearch) {
      item.style.display = "";
      visibleCount++;
    } else {
      item.style.display = "none";
    }
  });

  updateFilterEmptyMessage(visibleCount, searchQuery);
}

export function updateItemCount() {
  if (!DOM.listElement) return;

  // Count only visible items (items that pass both completion and search filters)
  // Sum quantities instead of counting unique items
  const items = DOM.listElement.querySelectorAll(".shopping-app__item");
  let totalQuantity = 0;
  let uniqueItemCount = 0;

  items.forEach((item) => {
    // Only count items that are currently visible (pass both filters)
    if (item.style.display !== "none") {
      uniqueItemCount++;
      // Get quantity from the input
      const quantityInput = item.querySelector(".shopping-app__quantity-input");
      const quantity = quantityInput
        ? parseInt(quantityInput.value, 10) || 1
        : 1;
      totalQuantity += quantity;
    }
  });

  // Update the count in the output element (show total quantity)
  DOM.itemCountOutput.textContent = totalQuantity;

  // Update the label text (singular vs plural)
  if (totalQuantity === 1) {
    DOM.itemsLabel.textContent = " item";
  } else {
    DOM.itemsLabel.textContent = " items";
  }

  // Show/hide filter buttons based on total unique item count
  toggleFilterButtons();

  // Update the filter empty state message if needed (use unique count for message logic)
  updateFilterEmptyMessage(uniqueItemCount);

  // Show/hide empty state and list based on total unique item count
  toggleEmptyState();

  // Update tooltip content
  updateCountTooltip();
}

/**
 * Show or hide empty state and list based on whether there are items
 */
export function toggleEmptyState() {
  if (!DOM.listElement || !DOM.emptyState) return;

  const totalItems = DOM.listElement.querySelectorAll(
    ".shopping-app__item"
  ).length;

  const emptyStateIllustration = document.querySelector(
    ".shopping-app__empty-state-illustration"
  );
  const emptyStateButton = document.querySelector(
    ".shopping-app__empty-state-button"
  );

  if (totalItems === 0) {
    // Show empty state, hide list
    DOM.emptyState.style.display = "flex";
    DOM.listElement.style.display = "none";
    // Hide the SVG illustration (only show after button click)
    if (emptyStateIllustration) {
      emptyStateIllustration.style.display = "none";
    }
    // Show the empty state button
    if (emptyStateButton) {
      emptyStateButton.style.display = "flex";
    }
    // Disable clear all button
    if (DOM.clearAllButton) {
      DOM.clearAllButton.disabled = true;
    }

    hideFilterEmptyMessage();
  } else {
    // Hide empty state, show list
    DOM.emptyState.style.display = "none";
    DOM.listElement.style.display = "";
    // Hide the SVG illustration
    if (emptyStateIllustration) {
      emptyStateIllustration.style.display = "none";
    }
    // Enable clear all button
    if (DOM.clearAllButton) {
      DOM.clearAllButton.disabled = false;
    }
  }
}

/**
 * Show or hide filter buttons based on whether there are items
 */
export function toggleFilterButtons() {
  if (!DOM.listElement || !DOM.filterAll) return;

  const totalItems = DOM.listElement.querySelectorAll(
    ".shopping-app__item"
  ).length;
  const filtersContainer = DOM.filterAll.closest(".shopping-app__filters");

  if (filtersContainer) {
    if (totalItems === 0) {
      filtersContainer.style.display = "none";
    } else {
      filtersContainer.style.display = "flex";
    }
  }
}

function updateFilterEmptyMessage(visibleCount, searchQueryOverride) {
  if (!DOM.listElement || !DOM.filterEmptyStateMessage) return;

  const totalItems = DOM.listElement.querySelectorAll(
    ".shopping-app__item"
  ).length;

  if (totalItems === 0) {
    hideFilterEmptyMessage();
    return;
  }

  const searchQuery =
    typeof searchQueryOverride === "string"
      ? searchQueryOverride
      : getSearchQuery();
  const hasSearch = Boolean(searchQuery);

  if (visibleCount !== 0) {
    hideFilterEmptyMessage();
    return;
  }

  let message = "";

  if (hasSearch) {
    if (currentFilter === "active") {
      message = "No active items match your search.";
    } else if (currentFilter === "completed") {
      message = "You don't have completed items that match your search.";
    } else {
      message = "No items match your search.";
    }
  } else if (currentFilter === "active") {
    message = "There are no active items in your list.";
  } else if (currentFilter === "completed") {
    message = "You don't have any completed items yet.";
  }

  if (!message) {
    hideFilterEmptyMessage();
    return;
  }

  DOM.filterEmptyStateMessage.hidden = false;
  DOM.filterEmptyStateMessage.textContent = message;
}

function hideFilterEmptyMessage() {
  if (!DOM.filterEmptyStateMessage) return;
  DOM.filterEmptyStateMessage.hidden = true;
  DOM.filterEmptyStateMessage.textContent = "";
}

/**
 * Update the count tooltip with item breakdown
 */
function updateCountTooltip() {
  if (!DOM.listElement || !DOM.countTooltipContent) return;

  // Get all visible items (respecting filters)
  const items = DOM.listElement.querySelectorAll(".shopping-app__item");
  const itemData = [];

  items.forEach((item) => {
    // Only include visible items
    if (item.style.display === "none") return;

    const nameElement = item.querySelector(".shopping-app__item-name");
    const quantityInput = item.querySelector(".shopping-app__quantity-input");

    if (nameElement && quantityInput) {
      const name = nameElement.textContent.trim();
      const quantity = parseInt(quantityInput.value, 10) || 1;

      if (name) {
        itemData.push({ name, quantity });
      }
    }
  });

  // Clear existing content
  DOM.countTooltipContent.innerHTML = "";

  // If no items, hide tooltip
  if (itemData.length === 0) {
    if (DOM.countTooltip) {
      DOM.countTooltip.setAttribute("aria-hidden", "true");
    }
    return;
  }

  // Build tooltip content
  itemData.forEach((item, index) => {
    const tooltipItem = document.createElement("div");
    tooltipItem.className = "shopping-app__count-tooltip-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "shopping-app__count-tooltip-item-name";
    nameSpan.textContent = item.name;

    const quantitySpan = document.createElement("span");
    quantitySpan.className = "shopping-app__count-tooltip-item-quantity";
    quantitySpan.textContent = `x${item.quantity}`;

    tooltipItem.appendChild(nameSpan);
    tooltipItem.appendChild(quantitySpan);
    DOM.countTooltipContent.appendChild(tooltipItem);
  });

  // Show tooltip
  if (DOM.countTooltip) {
    DOM.countTooltip.setAttribute("aria-hidden", "false");
  }
}
