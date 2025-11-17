// ============================================
// Search Filter Functionality
// ============================================

import { applyFilter, updateItemCount } from "./utils.js";

/**
 * Apply search filter and completion filter together
 * This function is called when the search input changes
 */
export function filterItems() {
  // Apply both filters together (completion status + search query)
  applyFilter();
  // Update item count to reflect visible items after filtering
  updateItemCount();
}

