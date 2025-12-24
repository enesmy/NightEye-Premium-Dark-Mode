document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('darkModeToggle');
    const statusText = document.getElementById('statusText');
    const sliderContainer = document.getElementById('sliderContainer');
    const darknessRange = document.getElementById('darknessRange');

    // Schedule elements
    const scheduleToggle = document.getElementById('scheduleToggle');
    const timeInputs = document.getElementById('timeInputs');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');

    // Premium elements
    const themeSelect = document.getElementById('themeSelect');
    const blueLightToggle = document.getElementById('blueLightToggle');

    // Whitelist element
    const whitelistBtn = document.getElementById('whitelistBtn');
    let currentDomain = "";

    // Get current tab domain
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0] && tabs[0].url) {
            try {
                const url = new URL(tabs[0].url);
                currentDomain = url.hostname;
                checkWhitelistStatus();
            } catch (e) {
                whitelistBtn.style.display = 'none';
            }
        } else {
            whitelistBtn.style.display = 'none';
        }
    });

    // Load saved state
    chrome.storage.local.get(['enabled', 'darknessLevel', 'scheduleEnabled', 'startTime', 'endTime', 'whitelist', 'theme', 'blueLight'], function (result) {
        // Main Toggle
        if (result.enabled) {
            toggle.checked = true;
            updateStatus(true);
            sliderContainer.style.display = 'block';
        } else {
            toggle.checked = false;
            updateStatus(false);
            sliderContainer.style.display = 'none';
        }

        // Darkness Level
        if (result.darknessLevel) {
            darknessRange.value = result.darknessLevel;
        } else {
            darknessRange.value = 75;
        }

        // Schedule Mode
        if (result.scheduleEnabled) {
            scheduleToggle.checked = true;
            timeInputs.style.display = 'flex';
        } else {
            scheduleToggle.checked = false;
            timeInputs.style.display = 'none';
        }

        if (result.startTime) startTimeInput.value = result.startTime;
        if (result.endTime) endTimeInput.value = result.endTime;

        // Theme
        if (result.theme) {
            themeSelect.value = result.theme;
        }

        // Blue Light Filter
        if (result.blueLight) {
            blueLightToggle.checked = true;
        }
    });

    // Listen for main toggle changes
    toggle.addEventListener('change', function () {
        const isEnabled = toggle.checked;
        updateStatus(isEnabled);

        if (isEnabled) {
            sliderContainer.style.display = 'block';
        } else {
            sliderContainer.style.display = 'none';
        }

        // Save state
        chrome.storage.local.set({ enabled: isEnabled });

        // Send message to active tab
        sendUpdate();
    });

    // Listen for slider changes
    darknessRange.addEventListener('input', function () {
        const level = darknessRange.value;
        chrome.storage.local.set({ darknessLevel: level });
        sendUpdate();
    });

    // Listen for schedule toggle
    scheduleToggle.addEventListener('change', function () {
        const isScheduleEnabled = scheduleToggle.checked;
        if (isScheduleEnabled) {
            timeInputs.style.display = 'flex';
        } else {
            timeInputs.style.display = 'none';
        }
        chrome.storage.local.set({ scheduleEnabled: isScheduleEnabled });

        // Notify background script to check schedule immediately
        chrome.runtime.sendMessage({ action: "checkSchedule" });
    });

    // Listen for time changes
    startTimeInput.addEventListener('change', function () {
        chrome.storage.local.set({ startTime: startTimeInput.value });
        chrome.runtime.sendMessage({ action: "checkSchedule" });
    });

    endTimeInput.addEventListener('change', function () {
        chrome.storage.local.set({ endTime: endTimeInput.value });
        chrome.runtime.sendMessage({ action: "checkSchedule" });
    });

    // Listen for Theme changes
    themeSelect.addEventListener('change', function () {
        chrome.storage.local.set({ theme: themeSelect.value });
        sendUpdate();
    });

    // Listen for Blue Light Filter changes
    blueLightToggle.addEventListener('change', function () {
        chrome.storage.local.set({ blueLight: blueLightToggle.checked });
        sendUpdate();
    });

    // Listen for whitelist button
    whitelistBtn.addEventListener('click', function () {
        chrome.storage.local.get(['whitelist'], function (result) {
            let whitelist = result.whitelist || [];
            const index = whitelist.indexOf(currentDomain);

            if (index === -1) {
                // Add to whitelist
                whitelist.push(currentDomain);
                whitelistBtn.textContent = "Enable for this site";
                whitelistBtn.style.color = "#00e5ff";
                whitelistBtn.style.borderColor = "#00e5ff";
            } else {
                // Remove from whitelist
                whitelist.splice(index, 1);
                whitelistBtn.textContent = "Disable for this site";
                whitelistBtn.style.color = "#aaa";
                whitelistBtn.style.borderColor = "#444";
            }

            chrome.storage.local.set({ whitelist: whitelist });

            // Refresh the tab to apply changes
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs[0]) {
                    chrome.tabs.reload(tabs[0].id);
                }
            });
        });
    });

    function checkWhitelistStatus() {
        chrome.storage.local.get(['whitelist'], function (result) {
            const whitelist = result.whitelist || [];
            if (whitelist.includes(currentDomain)) {
                whitelistBtn.textContent = "Enable for this site";
                whitelistBtn.style.color = "#00e5ff";
                whitelistBtn.style.borderColor = "#00e5ff";
            } else {
                whitelistBtn.textContent = "Disable for this site";
                whitelistBtn.style.color = "#aaa";
                whitelistBtn.style.borderColor = "#444";
            }
        });
    }

    function sendUpdate() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "updateDarkMode",
                    enabled: toggle.checked,
                    darknessLevel: darknessRange.value,
                    theme: themeSelect.value,
                    blueLight: blueLightToggle.checked
                });
            }
        });
    }

    function updateStatus(enabled) {
        if (enabled) {
            statusText.textContent = "Dark Mode is ON";
            statusText.style.color = "#00e5ff";
        } else {
            statusText.textContent = "Dark Mode is OFF";
            statusText.style.color = "#757575";
        }
    }
});
