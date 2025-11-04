// Trailhead Card Completion Script
// This script modifies incomplete course cards to appear as completed
// Runs continuously every 300ms to catch dynamically loaded content

let intervalId;
let totalModified = 0;

function completeCards() {
  // Find all course cards
  const cards = document.querySelectorAll('.tds-content-panel_body');
  let modifiedCount = 0;

  cards.forEach((card, index) => {
    // Check if card is already completed by looking for the completion checkmark
    const hasCheckmark = card.querySelector('.slds-icon-action-check');

    if (!hasCheckmark) {
      // Find the image container
      const imgContainer = card.querySelector('.slds-show_inline-block');

      if (imgContainer) {
        // Add completion checkmark if it doesn't exist
        const checkmarkHTML = `
          <div style="position: absolute; top: -0.25rem; right: -0.75rem; border: 3px solid white; border-radius: 100%;">
            <span class="slds-icon_container slds-icon_container_circle slds-icon-action-check tds-bg_success slds-show">
              <svg aria-hidden="true" class="slds-icon slds-icon_x-small">
                <use href="/packs/media/svg/symbols-129cc9ff.svg#check"></use>
              </svg>
              <span class="slds-assistive-text">complete</span>
            </span>
          </div>
        `;
        imgContainer.insertAdjacentHTML('beforeend', checkmarkHTML);
        imgContainer.classList.add('slds-is-relative');
      }

      // Find and modify the progress bar section
      const progressSection = card.querySelector('[data-test="progress-estimated-time-and-percentage"]');

      if (progressSection) {
        const parentDiv = progressSection.closest('.slds-grid.slds-grid_vertical-align-center.slds-text-align_right');

        if (parentDiv) {
          // Get current date in format like "Nov 3, 2025"
          const currentDate = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          // Replace progress bar with completion date
          parentDiv.innerHTML = `<span>Completed ${currentDate}</span>`;
        }
      }

      modifiedCount++;
      totalModified++;
      console.log(`✅ Card marked as complete (Total: ${totalModified})`);
    }
  });
}

// Start the interval
console.log('🚀 Starting Trailhead Card Completion Script (runs every 300ms)...');
console.log('⏹️  To stop: clearInterval(intervalId)');
intervalId = setInterval(completeCards, 300);

// Run immediately once
completeCards();