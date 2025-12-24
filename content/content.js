// Check storage on load
chrome.storage.local.get(['enabled', 'darknessLevel', 'whitelist', 'theme', 'blueLight'], function (result) {
    if (isWhitelisted(result.whitelist)) {
        console.log("Special Force: Site is whitelisted. Dark Mode disabled.");
        // Even if whitelisted for dark mode, we might want blue light filter? 
        // User request implied independence. Let's allow blue light even if whitelisted for dark mode?
        // "Dark mode kapalı olsa bile Blue light mode açık olabilir."
        // But whitelist usually means "don't touch this site". 
        // For now, let's respect whitelist for EVERYTHING to be safe, or separate them.
        // Let's assume whitelist disables EVERYTHING for now to avoid breaking sites.
        return;
    }

    // Apply Blue Light Filter independently
    if (result.blueLight) {
        enableBlueLightFilter();
    } else {
        disableBlueLightFilter();
    }

    // Apply Dark Mode
    if (result.enabled) {
        const level = result.darknessLevel || 75;
        const theme = result.theme || 'default';
        attemptEnableDarkMode(level, theme);
    }
});

// Listen for messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.storage.local.get(['whitelist'], function (result) {
        if (isWhitelisted(result.whitelist)) {
            disableDarkMode();
            disableBlueLightFilter();
            return;
        }

        if (request.action === "updateDarkMode") {
            // Handle Dark Mode
            if (request.enabled) {
                attemptEnableDarkMode(request.darknessLevel, request.theme);
            } else {
                disableDarkMode();
            }

            // Handle Blue Light Filter
            if (request.blueLight) {
                enableBlueLightFilter();
            } else {
                disableBlueLightFilter();
            }
        }
    });
});

function isWhitelisted(whitelist) {
    if (!whitelist) return false;
    const hostname = window.location.hostname;
    return whitelist.includes(hostname);
}

function attemptEnableDarkMode(level, theme) {
    if (isPageAlreadyDark()) {
        console.log("Special Force: Page is already dark. Skipping inversion.");
        return;
    }
    enableDarkMode(level, theme);
}

function enableDarkMode(level, theme) {
    const html = document.documentElement;
    html.classList.add('sf-dark-mode');

    // Remove existing theme classes
    html.classList.remove('sf-theme-midnight', 'sf-theme-forest', 'sf-theme-cyberpunk');

    // Add new theme class
    if (theme && theme !== 'default') {
        html.classList.add(`sf-theme-${theme}`);
    }

    // Calculate filter values based on level (50-100)
    const calculatedContrast = 0.7 + ((level - 50) / 50) * 0.2;
    const calculatedBrightness = 1.2 - ((level - 50) / 50) * 0.2;

    html.style.setProperty('--sf-contrast', calculatedContrast);
    html.style.setProperty('--sf-brightness', calculatedBrightness);

    // Update theme overlay
    updateThemeOverlay(theme);
}

function disableDarkMode() {
    const html = document.documentElement;
    html.classList.remove('sf-dark-mode', 'sf-theme-midnight', 'sf-theme-forest', 'sf-theme-cyberpunk');
    html.style.removeProperty('--sf-contrast');
    html.style.removeProperty('--sf-brightness');

    // Remove theme overlay
    updateThemeOverlay(null);
}

function enableBlueLightFilter() {
    let overlay = document.getElementById('sf-blue-light-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sf-blue-light-overlay';
        document.documentElement.appendChild(overlay);
    }
    // Ensure it's visible
    overlay.style.display = 'block';
}

function disableBlueLightFilter() {
    const overlay = document.getElementById('sf-blue-light-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function updateThemeOverlay(theme) {
    let overlay = document.getElementById('sf-theme-overlay');

    if (!theme || theme === 'default') {
        if (overlay) overlay.remove();
        return;
    }

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sf-theme-overlay';
        document.documentElement.appendChild(overlay);
    }

    // Reset classes
    overlay.className = '';
    overlay.classList.add(`sf-theme-${theme}-overlay`);
}

function isPageAlreadyDark() {
    // Helper to parse rgb/rgba string
    function getBrightness(color) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return 255; // Default to white if parse fails
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        // Standard brightness formula
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    let elem = document.body;
    if (!elem) return false;

    let bgColor = window.getComputedStyle(elem).backgroundColor;

    // If body is transparent, check html
    if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        elem = document.documentElement;
        bgColor = window.getComputedStyle(elem).backgroundColor;
    }

    // If still transparent, assume white (standard browser default)
    if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        return false;
    }

    const brightness = getBrightness(bgColor);
    // Threshold: if brightness < 128, it's considered dark
    return brightness < 128;
}
