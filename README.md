## 1) Clone or download the repo

Option A — clone the repo:

```sh
git clone https://github.com/Abhinav-Prajapati/sales.git
cd sales
```

Option B — download the repository as a ZIP from GitHub and extract it.

## 2) Load the extension in Chrome / Chromium-based browsers

1. Open Chrome and go to chrome://extensions
2. Enable **Developer mode** (toggle in the top-right)
3. Click **Load unpacked** and select the repository folder you cloned or extracted (the folder that contains `manifest.json` and `content.js`).
4. The extension will appear in the extensions list and be enabled.

Notes:
- If you are using Edge, use edge://extensions and follow the same steps.
- If the extension doesn't load, make sure `manifest.json` exists in the root of the folder you selected.

## 3) Open DevTools and enable "Show user agent shadow DOM"

1. Open the page where you want to inspect the extension's DOM (or the app page).
2. Right-click the page and choose **Inspect** (or press `Ctrl+Shift+I`).
3. In DevTools, click the three vertical dots (⋮) in the top-right corner of DevTools and choose **Settings**.
4. In Settings, select **Preferences** (left-hand menu). Under the **Elements** section, check **Show user agent shadow DOM**.
5. Close the Settings pane and refresh the page (press `F5` or `Ctrl+R`).

## 4) Troubleshooting

Nah man you are on your own

---