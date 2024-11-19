const ICON_PATHS = {
    active: {
      48: 'img/active.png',
      128: 'img/active.png'
    },
    inactive: {
      48: 'img/inactive.png',
      128: 'img/inactive.png'
    }
  };
  
  // Event listeners
  chrome.runtime.onInstalled.addListener(updateIcon);
  chrome.storage.onChanged.addListener(updateIcon);
  
  async function updateIcon() {
    try {
      const settings = await chrome.storage.sync.get(null);
      const hasActiveSettings = Object.values(settings).some(Boolean);
      const iconPaths = hasActiveSettings ? ICON_PATHS.active : ICON_PATHS.inactive;
      
      await chrome.action.setIcon({ path: iconPaths });
    } catch (error) {
      console.error('Failed to update icon:', error);
    }
  }