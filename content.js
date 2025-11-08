// Trailhead Card Completion Script
// This script modifies incomplete course cards to appear as completed
// Runs continuously every 300ms to catch dynamically loaded content
// enjoy your 10 makrs 

let intervalId;
let totalModified = 0;

// Configuration constants
const TOTAL_COURSE_HOURS = 40;
const DEFAULT_COMPLETION_PERCENT = 82; // number 0-100

// Profile page stats configuration
const PROFILE_BADGES_COUNT = 12;     // Number of badges to display
const PROFILE_POINTS_COUNT = 12012;  // Number of points to display

// Exclusion list: module URLs that should NOT run the module completion code
// Add module slugs (the part after /modules/) to this list
const EXCLUDED_MODULES = [
  'leads_opportunities_lightning_experience',
  'apex_integration_services',
  'lex_customization',
  'Lightning Experience Customization'
];

// Detect which page type we're on
const currentURL = window.location.href;
const isModulePage = currentURL.includes('trailhead.salesforce.com/content/learn/modules');
const isProfilePage = currentURL.includes('www.salesforce.com/trailblazer/profile');
const isTodayPage = currentURL.includes('trailhead.salesforce.com/today');

// Check if current module is in the exclusion list
function isExcludedModule() {
  if (!isModulePage) return false;

  return EXCLUDED_MODULES.some(slug => currentURL.includes(`/modules/${slug}`));
}

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

// Check if the "Sign Up" button is present (indicates user not logged in)
function isSignUpButtonPresent() {
  try {
    const contextnav = document.querySelector('#contextnav');
    if (contextnav && contextnav.shadowRoot) {
      const signUpButton = contextnav.shadowRoot.querySelector('div > div.contextnav > div.contextnav__header > div.contextnav__wrapper > nav.contextnav__ctas > div.contextnav__ctas-button-container.cta-primary > hgf-button');
      if (signUpButton && signUpButton.innerHTML.includes('Sign Up')) {
        return true;
      }
    }
  } catch (e) {
    // Element may not exist, silent fail
  }
  return false;
}

// ========== TRAIL PAGE COMPLETION (for trail/trailmix pages) ==========
function completeTrailPage() {
  // Skip if Sign Up button is present (user not logged in)
  if (isSignUpButtonPresent()) {
    return;
  }

  const timeLeft = computeTimeLeft(DEFAULT_COMPLETION_PERCENT);

  // Update progress header in shadow DOM
  try {
    document.querySelector('#main > div.trailmix_header > div').querySelector('tds-content-header').shadowRoot.querySelector('.content-container').querySelector('th-tds-content-summary').shadowRoot.querySelector('th-tds-summary > th-tds-content-progress').shadowRoot.querySelector('.completion').querySelector('.completion__text').innerHTML = `<span class="completion__text"><span>${timeLeft} • </span>${DEFAULT_COMPLETION_PERCENT}%</span>`;
    document.querySelector('#main > div.trailmix_header > div').querySelector('tds-content-header').shadowRoot.querySelector('.content-container').querySelector('th-tds-content-summary').shadowRoot.querySelector('th-tds-summary > th-tds-content-progress').shadowRoot.querySelector('.completion').querySelector('th-tds-progress-bar').shadowRoot.querySelector('.progress-bar.progress-bar--medium').querySelector('.progress-bar__value').style.width = `${DEFAULT_COMPLETION_PERCENT}%`;
    document.querySelector('#main > div.tds-bg_sand.slds-p-bottom_x-large.th-content-wrapper > div > div:nth-child(34) > div > div > div > div > div:nth-child(2) > div:nth-child(2) > span:nth-child(1) > span:nth-child(1)').innerText = timeLeft;
    document.querySelector('#main > div.tds-bg_sand.slds-p-bottom_x-large.th-content-wrapper > div > div:nth-child(34) > div > div > div > div > div:nth-child(2) > div:nth-child(2) > span:nth-child(2)').innerText = `${DEFAULT_COMPLETION_PERCENT} %`;
    document.querySelector('#main > div.tds-bg_sand.slds-p-bottom_x-large.th-content-wrapper > div > div:nth-child(34) > div > div > div > div > div:nth-child(2) > div.slds-grid.slds-grid_align-center.slds-m-vertical_x-small > div > div > span').style.width = `${DEFAULT_COMPLETION_PERCENT}%`;
  } catch (e) {
    // Elements might not be present yet, silent fail
  }

  // Process cards
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
        console.log(`Trail card marked as complete (Total: ${totalModified})`);
      }
    }
  });
}

// ========== MODULE PAGE COMPLETION (for module detail pages) ==========
function completeModulePage() {
  // 2. Update completion date
  try {
    const completionTarget = document.querySelector('#main > div.th-content-container > div.th-content-container_main > div:nth-child(3) > div > div > div > div:nth-child(2)');
    if (completionTarget) {
      completionTarget.innerHTML = '<div class="slds-m-top_x-small">Completed Oct 30, 2025</div>';
    }
  } catch (e) {
    // Element may not exist, silent fail
  }

  // 3. Replace arrow icons with green ticks
  try {
    const greenTickHTML = `
      <span class="slds-icon_container slds-icon_container_circle slds-icon-action-approval tds-bg_success">
        <svg aria-hidden="true" class="slds-icon slds-icon_x-small">
          <use href="/packs/media/svg/symbols-129cc9ff.svg#approval"></use>
        </svg>
        <span class="slds-assistive-text">Completed</span>
      </span>`;

    const arrowIcons = document.querySelectorAll('span.slds-icon-action-back');
    arrowIcons.forEach((icon) => {
      const parentDiv = icon.closest('.slds-text-align_right');
      if (parentDiv) {
        parentDiv.innerHTML = greenTickHTML;
      }
    });

    if (arrowIcons.length > 0) {
      console.log(`Replaced ${arrowIcons.length} arrow icons with green ticks.`);
    }
  } catch (e) {
    // Elements may not exist, silent fail
  }

  // 4. Add first badge (aside tile)
  try {
    const badgeTarget1 = document.querySelector('#th-content-container_aside > div.th-content_aside-tile > div > div.th-content-card_badge-header.slds-grid.slds-grid_vertical-align-center > div.slds-grid.slds-grid_align-spread.slds-container_center.slds-container_x-large.slds-p-horizontal_large > div');
    if (badgeTarget1 && !badgeTarget1.querySelector('.th-content-card_badge-image--completed')) {
      const badgeHTML = `
      <div class="th-content-card_badge-image--completed">
        <span class="slds-icon_container slds-icon_container_circle slds-icon-action-check tds-bg_success slds-show">
          <span class="slds-icon_container slds-icon-utility-check" style="" title="">
            <svg aria-hidden="true" class="slds-icon slds-icon_x-small">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols-e6382c2038036b01b4230804b934660723c3fa4f23aab0ef6bfce6541ad19590.svg#check" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
            </svg>
          </span>
        </span>
      </div>`;
      badgeTarget1.insertAdjacentHTML('beforeend', badgeHTML);
    }
  } catch (e) {
    // Element may not exist, silent fail
  }

  // 5. Add second badge (main content area)
  try {
    const badgeTarget2 = document.querySelector('#main > div.th-content-container > div.th-content-container_main > div:nth-child(3) > div > div > div > div.slds-grid.slds-grid_align-center > div > div');
    if (badgeTarget2 && !badgeTarget2.querySelector('.th-content-card_badge-image--completed')) {
      const badgeHTML = `
      <div class="th-content-card_badge-image--completed">
        <span class="slds-icon_container slds-icon_container_circle slds-icon-action-check tds-bg_success slds-show">
          <span class="slds-icon_container slds-icon-utility-check" style="" title="">
            <svg aria-hidden="true" class="slds-icon slds-icon_x-small">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols-e6382c2038036b01b4230804b934660723c3fa4f23aab0ef6bfce6541ad19590.svg#check" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
            </svg>
          </span>
        </span>
      </div>`;
      badgeTarget2.insertAdjacentHTML('beforeend', badgeHTML);
    }
  } catch (e) {
    // Element may not exist, silent fail
  }

  // 6. Remove all <a> tags inside the aside tile container
  try {
    const asideTileContainer = document.querySelector('#th-content-container_aside > div.th-content_aside-tile > div > div.th-content-card_container.slds-container_center');
    if (asideTileContainer) {
      const allLinks = asideTileContainer.querySelectorAll('a');
      allLinks.forEach(link => link.remove());
      if (allLinks.length > 0) {
        console.log(`Removed ${allLinks.length} <a> tags from aside tile container.`);
      }
    }
  } catch (e) {
    // Element may not exist, silent fail
  }
}

// ========== PROFILE PAGE STATS UPDATE (for Trailblazer profile) ==========
function updateProfileStats() {
  // 1. Update badges count (first tally)
  try {
    const badgesTally = document.querySelector('#profile-sections-container > div:nth-child(3) > tbme-rank');
    if (badgesTally && badgesTally.shadowRoot) {
      const badgesCount = badgesTally.shadowRoot.querySelector('lwc-tds-theme-provider > lwc-tbui-card > div.stats-container > lwc-tbui-tally:nth-child(1)');
      if (badgesCount && badgesCount.shadowRoot) {
        const badgesSpan = badgesCount.shadowRoot.querySelector('span > span.tally__count.tally__count_success');
        if (badgesSpan) {
          badgesSpan.innerText = String(PROFILE_BADGES_COUNT);
        }
      }
    }
  } catch (e) {
    // Element may not exist, silent fail
  }

  // 2. Update points count (second tally)
  try {
    const pointsTally = document.querySelector('#profile-sections-container > div:nth-child(3) > tbme-rank');
    if (pointsTally && pointsTally.shadowRoot) {
      const pointsCount = pointsTally.shadowRoot.querySelector('lwc-tds-theme-provider > lwc-tbui-card > div.stats-container > lwc-tbui-tally:nth-child(2)');
      if (pointsCount && pointsCount.shadowRoot) {
        const pointsSpan = pointsCount.shadowRoot.querySelector('span > span.tally__count.tally__count_success');
        if (pointsSpan) {
          pointsSpan.innerText = String(PROFILE_POINTS_COUNT);
        }
      }
    }
  } catch (e) {
    // Element may not exist, silent fail
  }
}

// ========== TODAY PAGE UPDATE (for Trailhead Today page) ==========
function updateTodayPage() {
  // 1. Update completion percentage text in "Jump Back In" section
  try {
    const todayPage = document.querySelector('#main > thtoday-page');
    if (todayPage && todayPage.shadowRoot) {
      const jumpBackIn = todayPage.shadowRoot.querySelector('#jump-back-in');
      if (jumpBackIn && jumpBackIn.shadowRoot) {
        const progressElement = jumpBackIn.shadowRoot.querySelector('th-tds-card > th-tds-content-collection-item > div > div > th-tds-content-progress');
        if (progressElement && progressElement.shadowRoot) {
          const percentSpan = progressElement.shadowRoot.querySelector('span > span');
          if (percentSpan) {
            percentSpan.innerText = `${DEFAULT_COMPLETION_PERCENT}%`;
          }
        }
      }
    }
  } catch (e) {
    // Element may not exist, silent fail
  }

  // 2. Update progress bar width in "Jump Back In" section
  try {
    const todayPage = document.querySelector('#main > thtoday-page');
    if (todayPage && todayPage.shadowRoot) {
      const jumpBackIn = todayPage.shadowRoot.querySelector('#jump-back-in');
      if (jumpBackIn && jumpBackIn.shadowRoot) {
        const progressElement = jumpBackIn.shadowRoot.querySelector('th-tds-card > th-tds-content-collection-item > div > div > th-tds-content-progress');
        if (progressElement && progressElement.shadowRoot) {
          const progressBar = progressElement.shadowRoot.querySelector('span > th-tds-progress-bar');
          if (progressBar && progressBar.shadowRoot) {
            const progressDiv = progressBar.shadowRoot.querySelector('div');
            if (progressDiv) {
              progressDiv.style.setProperty('--progress-min-width', '5.5em');
            }
          }
        }
      }
    }
  } catch (e) {
    // Element may not exist, silent fail
  }

  // 3. Update points count in "About Me" section
  try {
    const todayPage = document.querySelector('#main > thtoday-page');
    if (todayPage && todayPage.shadowRoot) {
      const aboutMe = todayPage.shadowRoot.querySelector('#about-me');
      if (aboutMe && aboutMe.shadowRoot) {
        const summaryHeading = aboutMe.shadowRoot.querySelector('th-tds-card > div > div.summary > div');
        if (summaryHeading) {
          summaryHeading.innerText = `You have ${PROFILE_POINTS_COUNT.toLocaleString()} points`;
        }
      }
    }
  } catch (e) {
    // Element may not exist, silent fail
  }
}

// ========== MAIN EXECUTION ROUTER ==========
function completeCards() {
  // Skip module completion if the current module is excluded
  if (isModulePage && isExcludedModule()) {
    // Do nothing for excluded modules
    return;
  }

  if (isTodayPage) {
    updateTodayPage();
  } else if (isProfilePage) {
    updateProfileStats();
  } else if (isModulePage) {
    completeModulePage();
  } else {
    completeTrailPage();
  }
}

console.log(`Starting Trailhead Completion Script (runs every 300ms)...`);
console.log(`Page type: ${isTodayPage ? 'TODAY' : isProfilePage ? 'PROFILE' : isModulePage ? 'MODULE' : 'TRAIL'}`);
if (isModulePage && isExcludedModule()) {
  console.log(`⚠️ This module is in the exclusion list - skipping completion modifications`);
}
if (!isModulePage && !isProfilePage && !isTodayPage && isSignUpButtonPresent()) {
  console.log(`⚠️ Sign Up button detected - user not logged in, skipping trail modifications`);
}
console.log('To stop: clearInterval(intervalId)');
intervalId = setInterval(completeCards, 300);

completeCards();