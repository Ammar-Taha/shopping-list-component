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
  const items = DOM.listElement.querySelectorAll(".shopping-app__item");
  let count = 0;

  items.forEach((item) => {
    // Only count items that are currently visible (pass both filters)
    if (item.style.display !== "none") {
      count++;
    }
  });

  // Update the count in the output element
  DOM.itemCountOutput.textContent = count;

  // Update the label text (singular vs plural)
  if (count === 1) {
    DOM.itemsLabel.textContent = " item";
  } else {
    DOM.itemsLabel.textContent = " items";
  }

  // Show/hide filter buttons based on total item count
  toggleFilterButtons();

  // Update the filter empty state message if needed
  updateFilterEmptyMessage(count);

  // Show/hide empty state and list based on total item count
  toggleEmptyState();
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
