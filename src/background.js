'use strict';

console.log('background running');

// when the extension is installed, show everything
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ active: false })
    chrome.storage.sync.set({
        settings: {
            youtube: {
                homepage: {
                    hide: false,
                    id: "homepage"
                },
                comments: {
                    hide: false,
                    id: "comments"
                },
                playlists: {
                    hide: false,
                    id: "playlist"
                },
                recommendations: {
                    hide: false,
                    id: "related"
                },
                merch: {
                    hide: false,
                    id: "merch"
                },
            }
        }
    })
})

function sendStatus(pTabID, pTabURL){
    chrome.storage.sync.get('active', function (response) {
        let message = {
            type: response.active ? "hideAll" : "showAll",
            firstTime: true, //this page was just opended for the first time
            source: "background.js",
            url: pTabURL
        }
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


var pages = new Array("https://www.youtube.com/")

function checkURL(url) {
    //return (pages.indexOf(url) != -1)
    //console.log("checking " + url)
    //console.log("returning " + url.startsWith(pages[0]))
    return url.startsWith(pages[0])
}