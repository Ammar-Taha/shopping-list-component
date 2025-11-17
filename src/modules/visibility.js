// ============================================
// Visibility Toggle Functionality
// ============================================

import { DOM } from "./dom.js";

export function toggleListVisibility(isHidden) {
  if (!DOM.itemsSection) {
    return;
  }

  const emptyStateIllustration = document.querySelector(
    ".shopping-app__empty-state-illustration"
  );
  const emptyState = document.getElementById("empty-state");
  const listElement = DOM.listElement;

  if (isHidden) {
    // Hide the list and other content, but show the empty state container and SVG
    if (listElement) {
      listElement.style.display = "none";
    }
    // Hide the filters
    const filtersContainer = document.querySelector(".shopping-app__filters");
    if (filtersContainer) {
      filtersContainer.style.display = "none";
    }
    // Hide the items heading
    const itemsHeading = document.querySelector(".shopping-app__items-heading");
    if (itemsHeading) {
      itemsHeading.style.display = "none";
    }
    // Show the empty state container and SVG
    if (emptyState) {
      emptyState.style.display = "flex";
    }
    if (emptyStateIllustration) {
      emptyStateIllustration.style.display = "block";
    }
    // Hide the empty state button if it exists
    const emptyStateButton = document.querySelector(
      ".shopping-app__empty-state-button"
    );
    if (emptyStateButton) {
      emptyStateButton.style.display = "none";
    }
  } else {
    // Calculate total items first
    const totalItems = listElement
      ? listElement.querySelectorAll(".shopping-app__item").length
      : 0;
    
    // Show the list only if there are items
    if (listElement) {
      if (totalItems > 0) {
        listElement.style.display = "";
      } else {
        listElement.style.display = "none";
      }
    }
    // Show the filters if there are items
    const filtersContainer = document.querySelector(".shopping-app__filters");
    if (filtersContainer && totalItems > 0) {
      filtersContainer.style.display = "flex";
    }
    // Show the items heading
    const itemsHeading = document.querySelector(".shopping-app__items-heading");
    if (itemsHeading) {
      itemsHeading.style.display = "flex";
    }
    // Hide focus illustration when hide list is unchecked
    if (emptyStateIllustration) {
      emptyStateIllustration.style.display = "none";
    }
    // Hide empty state if there are items, show it if empty
    if (emptyState) {
      if (totalItems === 0) {
        emptyState.style.display = "flex";
        // Show the empty state button when there are no items
        const emptyStateButton = document.querySelector(
          ".shopping-app__empty-state-button"
        );
        if (emptyStateButton) {
          emptyStateButton.style.display = "flex";
        }
      } else {
        emptyState.style.display = "none";
      }
    }
  }
}

