// ============================================
// Centralized DOM Element References
// ============================================

export const DOM = {
  listElement: document.querySelector(".shopping-app__list"),
  itemCountOutput: document.querySelector(".shopping-app__item-count"),
  itemsLabel: document.querySelector('[aria-label="items in list"]'),
  addForm: document.querySelector(".shopping-app__add-form"),
  itemInput: document.getElementById("item-input"),
  addButton: document.querySelector(
    ".shopping-app__add-form button[type='submit']"
  ),
  hideListCheckbox: document.getElementById("hide-list"),
  itemsSection: document.querySelector(".shopping-app__items"),
  searchInput: document.getElementById("search-input"),
  filterAll: document.getElementById("filter-all"),
  filterActive: document.getElementById("filter-active"),
  filterCompleted: document.getElementById("filter-completed"),
  clearAllButton: document.getElementById("clear-all"),
  emptyState: document.getElementById("empty-state"),
  emptyStateButton: document.querySelector(".shopping-app__empty-state-button"),
  filterEmptyStateMessage: document.getElementById("filter-empty-state"),
};
