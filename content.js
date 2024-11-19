// Configuration object
const CONFIG = {
    classes: {
        hideHome: 'full-focus-hide-home',
        hideRecommendations: 'full-focus-hide-recommendations',
        hideComments: 'full-focus-hide-comments',
        hideShorts: 'full-focus-hide-shorts',
        hideThumbnails: 'full-focus-hide-thumbnails',
        hideAds: 'full-focus-hide-ads'
    },
    selectors: {
        autoplayButton: '.ytp-autonav-toggle-button[aria-checked="true"]'
    }
};

class FullFocus {
    constructor() {
        this.settings = {};
        this.contentObserver = null;
        this.autoplayObserver = null;
        
        this.initializeSettings();
        this.setupMessageListener();
        this.initializeObserver();
    }

    initializeSettings() {
        chrome.storage.sync.get(null, (result) => {
            this.settings = result;
            this.applySettings();
        });
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((message) => {
            if (message.type === 'settingChanged') {
                this.settings[message.setting] = message.value;
                this.applySettings();
            }
        });
    }

    applySettings() {
        // Apply class toggles
        Object.entries(CONFIG.classes).forEach(([setting, className]) => {
            document.body.classList.toggle(className, this.settings[setting]);
        });

        // Handle autoplay
        if (this.settings.disableAutoplay) {
            this.disableAutoplay();
        }
    }

    disableAutoplay() {
        if (this.autoplayObserver) {
            this.autoplayObserver.disconnect();
        }

        this.autoplayObserver = new MutationObserver(() => {
            const autoplayToggle = document.querySelector(CONFIG.selectors.autoplayButton);
            if (autoplayToggle) {
                autoplayToggle.click();
                this.autoplayObserver.disconnect();
            }
        });

        this.autoplayObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupContentObserver() {
        if (this.contentObserver) {
            this.contentObserver.disconnect();
        }

        this.contentObserver = new MutationObserver(() => {
            this.applySettings();
        });

        this.contentObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    initializeObserver() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupContentObserver());
        } else {
            this.setupContentObserver();
        }
    }
}

// Initialize the application
new FullFocus();