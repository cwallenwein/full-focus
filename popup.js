class YoutubeSettingsManager {
    constructor() {
        this.FEATURE_IDS = [
            'hideHome',
            'hideRecommendations',
            'disableAutoplay',
            'hideComments',
            'hideShorts',
            'hideThumbnails',
            'hideAds'
        ];
        
        this.masterToggle = document.getElementById('masterToggle');
        this.statusEl = document.getElementById('status');
        this.isUpdating = false;
        
        this.initializeEventListeners();
    }

    showStatus(message) {
        this.statusEl.textContent = message;
        this.statusEl.classList.add('show');
        setTimeout(() => {
            this.statusEl.classList.remove('show');
        }, 2000);
    }

    updateMasterToggleState() {
        if (this.isUpdating) return;

        const checkboxes = this.FEATURE_IDS.map(id => document.getElementById(id));
        const checkedCount = checkboxes.filter(cb => cb.checked).length;

        this.masterToggle.checked = checkedCount === this.FEATURE_IDS.length;
        this.masterToggle.indeterminate = checkedCount > 0 && checkedCount < this.FEATURE_IDS.length;
    }

    async updateFeatures(changes) {
        try {
            await chrome.storage.sync.set(changes);
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (activeTab?.url?.includes('youtube.com')) {
                const updatePromises = Object.entries(changes).map(([setting, value]) => 
                    chrome.tabs.sendMessage(activeTab.id, {
                        type: 'settingChanged',
                        setting,
                        value
                    })
                );
                
                await Promise.all(updatePromises);
                this.showStatus('Settings updated');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            this.showStatus('Error updating settings');
        }
    }

    async handleMasterToggle() {
        this.isUpdating = true;
        const newState = this.masterToggle.checked;
        
        const updates = Object.fromEntries(
            this.FEATURE_IDS.map(id => {
                const checkbox = document.getElementById(id);
                checkbox.checked = newState;
                return [id, newState];
            })
        );

        await this.updateFeatures(updates);
        this.isUpdating = false;
    }

    async handleFeatureToggle(featureId) {
        if (this.isUpdating) return;

        const checkbox = document.getElementById(featureId);
        await this.updateFeatures({ [featureId]: checkbox.checked });
        this.updateMasterToggleState();
    }

    async initializeSettings() {
        try {
            const savedSettings = await chrome.storage.sync.get(this.FEATURE_IDS);
            this.FEATURE_IDS.forEach(id => {
                const checkbox = document.getElementById(id);
                checkbox.checked = savedSettings[id] ?? false;
                checkbox.addEventListener('change', () => this.handleFeatureToggle(id));
            });

            this.updateMasterToggleState();
        } catch (error) {
            console.error('Error loading settings:', error);
            this.showStatus('Error loading settings');
        }
    }

    initializeEventListeners() {
        this.masterToggle.addEventListener('change', () => this.handleMasterToggle());
        
        const feedbackButton = document.getElementById('feedbackButton');
        feedbackButton.addEventListener('click', () => {
            chrome.tabs.create({ 
                url: 'https://go.cwallenwein.com/projects/full-focus/feedback' 
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const manager = new YoutubeSettingsManager();
    await manager.initializeSettings();
});