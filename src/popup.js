// request all settings from storage when popup is opened
// and update settings when necessary
chrome.storage.sync.get('settings', function(response){
    for(let key in response.settings.youtube){
        var current = document.getElementById(key)
        
        // check or uncheck checkboxes based on settings
        current.checked = response.settings.youtube[key]

        // add EventListener that updates the settings
        current.addEventListener("click", function(){
            response.settings.youtube[key] = !response.settings.youtube[key]
            chrome.storage.sync.set({settings: response.settings})
        })
    }
})