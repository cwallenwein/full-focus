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


// send message to content-script when the tab is updated
// TODO find out why this eventListener only matters
// when changing the current url in the url bar,
// but not when clicking on a link (tried it with reccomendations)
chrome.tabs.onUpdated.addListener(sendStatus)

function sendStatus(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        chrome.storage.sync.get('active', function (response) {
            let message = {
                type: response.active ? "hideAll" : "showAll",
                firstTime: true //this page was just opended for the first time
            }
            chrome.tabs.sendMessage(tab.id, message)
        })
    }
}

var pages = new Array("https://www.youtube.com/")

function checkURL(url) {
    //return (pages.indexOf(url) != -1)
    //console.log("checking " + url)
    //console.log("returning " + url.startsWith(pages[0]))
    return url.startsWith(pages[0])
}