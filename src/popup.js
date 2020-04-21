// TODO both messages have to be sent to all open YouTube tabs, not only the active one
// otherwise a page in the background wouldn't update
// or you could find another way
// propably it is smartest to update on focus, because this would cover most usecases and will be less work when clicking
// but somehow you have to make sure it is not always sending the message when focusing, because there might be many useless requests
// a useless request might be, if you have music on youtube on in one page, and you sometimes click on it to go to another timestamp in the video
// not sure if this happens that many times

// TODO remove redundant code

// activate extension
chrome.storage.sync.get('active', function (response) {
    var current = document.getElementById("extension")

    // check or uncheck checkboxes based on settings
    current.checked = response.active

    // add EventListener that updates the settings
    current.addEventListener("click", function () {
        // toggle setting
        response.active = !response.active

        // TODO update icon
        chrome.browserAction.setIcon({path: response.active + ".png"});

        // update setting in storage
        chrome.storage.sync.set({ active: response.active })

        // send message to content.js
        // toggles between activating all elements (as stated in the settings) or deactivating all elements
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            // if(checkURL(tabs.url))
            let message = {
                type: response.active ? "hideAll" : "showAll",
                source: "popup.js",
                url: tabs[0].url
            }
            console.log(message)
            chrome.tabs.sendMessage(tabs[0].id, message);
        })
    })
})

// youtube settings
// request all settings from storage when popup is opened
// and update settings when necessary
chrome.storage.sync.get('settings', function (response) {

    // code for YouTube
    for (let key in response.settings.youtube) {
        var current = document.getElementById(key)

        // check or uncheck checkboxes based on settings
        current.checked = response.settings.youtube[key].hide

        // add EventListener that updates the settings
        current.addEventListener("click", function () {
            // toggle settings
            response.settings.youtube[key].hide = !response.settings.youtube[key].hide
            
            // update setting in storage
            chrome.storage.sync.set({ settings: response.settings })

            // send message to content.js
            // toggles between activating all elements (as stated in the settings) or deactivating all elements
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                // if(checkURL(tabs.url))
                let message = {
                    type: response.settings.youtube[key].hide ? "hideOne" : "showOne",
                    element: key,
                    source: "popup.js",
                    url: tabs[0].url
                }
                console.log(message)
                chrome.tabs.sendMessage(tabs[0].id, message);
            })
        })
    }
})