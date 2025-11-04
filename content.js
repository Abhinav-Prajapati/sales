// Trailhead Card Completion Script
// This script modifies incomplete course cards to appear as completed
// Runs continuously every 300ms to catch dynamically loaded content
// enjoy your 10 makrs 

let intervalId;
let totalModified = 0;

const TOTAL_COURSE_HOURS = 40;
const DEFAULT_COMPLETION_PERCENT = 84; // number 0-100

function computeTimeLeft(percent) {
  const remainingFraction = (100 - percent) / 100;
  let remainingHoursFloat = TOTAL_COURSE_HOURS * remainingFraction;
  let hours = Math.floor(remainingHoursFloat);
  let minutes = Math.round((remainingHoursFloat - hours) * 60);

  minutes = Math.round(minutes / 5) * 5;
  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }

  const hrsLabel = hours === 1 ? 'hr' : 'hrs';
  const minsLabel = minutes === 1 ? 'min' : 'mins';

  if (hours === 0 && minutes === 0) {
    return `0 ${minsLabel} left`;
  }
  if (hours === 0) {
    return `~ ${minutes} ${minsLabel} left`;
  }
  if (minutes === 0) {
    return `~ ${hours} ${hrsLabel} left`;
  }
  return `~ ${hours} ${hrsLabel} ${minutes} ${minsLabel} left`;
}

function completeCards() {

  const timeLeft = computeTimeLeft(DEFAULT_COMPLETION_PERCENT);

  document.querySelector('#main > div.trailmix_header > div').querySelector('tds-content-header').shadowRoot.querySelector('.content-container').querySelector('th-tds-content-summary').shadowRoot.querySelector('th-tds-summary > th-tds-content-progress').shadowRoot.querySelector('.completion').querySelector('.completion__text').innerHTML = `<span class="completion__text"><span>${timeLeft} • </span>${DEFAULT_COMPLETION_PERCENT}%</span>`;
  document.querySelector('#main > div.trailmix_header > div').querySelector('tds-content-header').shadowRoot.querySelector('.content-container').querySelector('th-tds-content-summary').shadowRoot.querySelector('th-tds-summary > th-tds-content-progress').shadowRoot.querySelector('.completion').querySelector('th-tds-progress-bar').shadowRoot.querySelector('.progress-bar.progress-bar--medium').querySelector('.progress-bar__value').style.width = `${DEFAULT_COMPLETION_PERCENT}%`;
  document.querySelector('#main > div.tds-bg_sand.slds-p-bottom_x-large.th-content-wrapper > div > div:nth-child(34) > div > div > div > div > div:nth-child(2) > div:nth-child(2) > span:nth-child(1) > span:nth-child(1)').innerText = timeLeft;
  document.querySelector('#main > div.tds-bg_sand.slds-p-bottom_x-large.th-content-wrapper > div > div:nth-child(34) > div > div > div > div > div:nth-child(2) > div:nth-child(2) > span:nth-child(2)').innerText = `${DEFAULT_COMPLETION_PERCENT} %`;
  document.querySelector('#main > div.tds-bg_sand.slds-p-bottom_x-large.th-content-wrapper > div > div:nth-child(34) > div > div > div > div > div:nth-child(2) > div.slds-grid.slds-grid_align-center.slds-m-vertical_x-small > div > div > span').style.width = `${DEFAULT_COMPLETION_PERCENT}%`;
  const cards = document.querySelectorAll('.tds-content-panel_body');
  let modifiedCount = 0;

  cards.forEach((card, index) => {
    if (index < cards.length - 2) {
      const hasCheckmark = card.querySelector('.slds-icon-action-check');

      if (!hasCheckmark) {
        const imgContainer = card.querySelector('.slds-show_inline-block');

        if (imgContainer) {
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

        const progressSection = card.querySelector('[data-test="progress-estimated-time-and-percentage"]');

        if (progressSection) {
          const parentDiv = progressSection.closest('.slds-grid.slds-grid_vertical-align-center.slds-text-align_right');

          if (parentDiv) {
            const currentDate = new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            parentDiv.innerHTML = `<span>Completed ${currentDate}</span>`;
          }
        }

        modifiedCount++;
        totalModified++;
        console.log(`Card marked as complete (Total: ${totalModified})`);
      }
    }
  });
}

console.log('Starting Trailhead Card Completion Script (runs every 300ms)...');
console.log('To stop: clearInterval(intervalId)');
intervalId = setInterval(completeCards, 300);

completeCards();