console.log("Trailhead Extension: Injected! Script will run every 200ms.");

// A marker class to know which modules we've already processed
const MARKER_CLASS = 'th-mod-completed';

function completeAllModules() {

  // We need to find the SVG path every time in case the function
  // runs before the first completed module is available.
  let svgPath = "";
  const existingCheck = document.querySelector('a.slds-is-relative .slds-icon-action-check svg use');
  if (existingCheck && existingCheck.getAttribute('href')) {
    svgPath = existingCheck.getAttribute('href');
  } else {
    // If no checkmark is found on the page yet, use the fallback path.
    svgPath = "/packs/media/svg/symbols-129cc9ff.svg#check";
  }

  // Find all modules that we *haven't* processed yet
  const allModules = document.querySelectorAll(
    `div[data-react-class="ModuleBrick"]:not(.${MARKER_CLASS})`
  );

  // If we found new modules, process them
  if (allModules.length > 0) {
    let modulesChanged = 0;

    allModules.forEach((module) => {
      try {
        // Add the marker class *immediately*
        // This prevents the script from processing this module again
        // in the next 200ms interval.
        module.classList.add(MARKER_CLASS);

        const props = JSON.parse(module.dataset.reactProps);

        // Only modify modules that are actually incomplete
        if (props.user && props.user.completed === false) {

          // --- A: Replace the progress bar ---
          const progressBar = module.querySelector('div[role="progressbar"]');
          if (progressBar) {
            const progressContainer = progressBar.parentElement;
            if (progressContainer) {
              const today = new Date();
              const dateString = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              progressContainer.innerHTML = ''; // Clear old content
              progressContainer.innerText = `Completed ${dateString}`; // Set new text

              Object.assign(progressContainer.style, {
                color: '#54698d',
                fontSize: '14px',
                paddingTop: '8px',
                height: 'auto'
              });
            }
          }

          // --- B: Add the official checkmark HTML ---
          const badgeLink = module.querySelector('a.slds-is-relative.slds-show_inline-block');
          if (badgeLink) {
            const checkmarkDiv = document.createElement('div');
            Object.assign(checkmarkDiv.style, {
              position: 'absolute',
              top: '-0.25rem',
              right: '-0.75rem',
              border: '3px solid white',
              borderRadius: '100%'
            });
            checkmarkDiv.innerHTML = `
              <span class="slds-icon_container slds-icon_container_circle slds-icon-action-check tds-bg_success slds-show">
                <svg aria-hidden="true" class="slds-icon slds-icon_x-small">
                  <use href="${svgPath}"></use>
                </svg>
                <span class="slds-assistive-text">complete</span>
              </span>
            `;
            badgeLink.appendChild(checkmarkDiv);
          }
          modulesChanged++;
        }
      } catch (e) {
        // Log error but don't stop the loop
        console.error("Could not modify a module:", e, module);
      }
    });

    // Only log if we actually changed something
    if (modulesChanged > 0) {
      console.log(`Trailhead Extension: Updated ${modulesChanged} new modules.`);
    }
  }
}

// --- Run the function every 200 milliseconds ---
setInterval(completeAllModules, 200);