// activate extension
chrome.storage.sync.get('active', function (response) {
    var current = document.getElementById("extension")

    // check or uncheck checkboxes based on settings
    current.checked = response.active

    // add EventListener that updates the settings
    current.addEventListener("click", function () {
        // toggle setting
        response.active = !response.active

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
            chrome.tabs.sendMessage(tabs[0].id, message, function () {
            });
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
                chrome.tabs.sendMessage(tabs[0].id, message, function () {
                });
            })
        })
    }
})

// TODO: check website-urls in background.js
var pages = new Array("https://www.youtube.com/")

function checkURL(url) {
    //return (pages.indexOf(url) != -1)
    //console.log("checking " + url)
    //console.log("returning " + url.startsWith(pages[0]))
    return url.startsWith(pages[0])
}