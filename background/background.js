// Initialize
chrome.runtime.onInstalled.addListener(() => {
    console.log("Special Force: Dark Mode Installed");
    chrome.storage.local.get(['enabled', 'scheduleEnabled', 'startTime', 'endTime'], function (result) {
        if (result.enabled === undefined) {
            chrome.storage.local.set({ enabled: false });
        }
        // Default schedule
        if (!result.startTime) chrome.storage.local.set({ startTime: "20:00" });
        if (!result.endTime) chrome.storage.local.set({ endTime: "07:00" });
    });

    // Create alarm for checking schedule every minute
    chrome.alarms.create("checkSchedule", { periodInMinutes: 1 });
});

// Alarm listener
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "checkSchedule") {
        checkSchedule();
    }
});

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkSchedule") {
        checkSchedule();
    }
});

function checkSchedule() {
    chrome.storage.local.get(['enabled', 'scheduleEnabled', 'startTime', 'endTime'], function (result) {
        if (!result.scheduleEnabled) return;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const [startHour, startMinute] = (result.startTime || "20:00").split(':').map(Number);
        const [endHour, endMinute] = (result.endTime || "07:00").split(':').map(Number);

        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        let shouldBeOn = false;

        if (startTime < endTime) {
            // Schedule is within the same day (e.g., 10:00 to 14:00)
            shouldBeOn = currentTime >= startTime && currentTime < endTime;
        } else {
            // Schedule crosses midnight (e.g., 20:00 to 07:00)
            shouldBeOn = currentTime >= startTime || currentTime < endTime;
        }

        // Force update if state doesn't match schedule
        if (shouldBeOn && !result.enabled) {
            // Turn ON
            chrome.storage.local.set({ enabled: true });
            broadcastUpdate(true);
            console.log("Schedule: Turning Dark Mode ON");
        } else if (!shouldBeOn && result.enabled) {
            // Turn OFF
            chrome.storage.local.set({ enabled: false });
            broadcastUpdate(false);
            console.log("Schedule: Turning Dark Mode OFF");
        }
    });
}

function broadcastUpdate(enabled) {
    chrome.storage.local.get(['darknessLevel', 'theme', 'blueLight'], function (result) {
        const level = result.darknessLevel || 75;
        const theme = result.theme || 'default';
        const blueLight = result.blueLight || false;

        chrome.tabs.query({}, function (tabs) {
            for (let tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {
                    action: "updateDarkMode",
                    enabled: enabled,
                    darknessLevel: level,
                    theme: theme,
                    blueLight: blueLight
                }).catch(() => {
                    // Ignore errors for tabs that don't have the content script
                });
            }
        });
    });
}
