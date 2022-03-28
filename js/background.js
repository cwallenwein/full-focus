'use strict';

console.log('background running');

// TODO not all elements are about hiding and showing stuff, for example enabling autoplay. Maybe find another name

// when the extension is installed, show everything
chrome.runtime.onInstalled.addListener(function () {
    
    let activeOnStart = false
    chrome.storage.sync.set({ active: activeOnStart })
    updateIcon(activeOnStart)

    chrome.storage.sync.set({
        settings: {
            youtube: {
                homepage: {
                    hide: false,
                },
                comments: {
                    hide: false,
                },
                playlists: {
                    hide: false,
                },
                recommendations: {
                    hide: false,
                },
                merch: {
                    hide: false,
                },
                recommendationsAfterVideo: {
                    hide: false,
                },
                autoplay: {
                    hide: false,
                },
                chat: {
                    hide: false,
                }
            }
        }
    })
})

function sendStatus(pTabID, pTabURL){
    chrome.storage.sync.get('active', function (response) {
        let message = {
            type: response.active ? "enableExtension" : "disableExtension",
            firstTime: true, //this page was just opended for the first time
            source: "background.js",
            url: pTabURL
        }
        console.log(message)
        updateIcon(response.active)
        chrome.tabs.sendMessage(pTabID, message)
    })
}

// send message to content-script when a new tab is opened
chrome.tabs.onCreated.addListener(function(tab){
    sendStatus(tab.id, tab.url)
})

// send message to content-script when the tab is updated
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        sendStatus(tabId, tab.url)
    }
})

chrome.tabs.onActivated.addListener(function(activeInfo){
    sendStatus(activeInfo.tabId, undefined)
})

function updateIcon(showIcon){
    chrome.browserAction.setIcon({path: "../img/" + showIcon + ".png"});
}