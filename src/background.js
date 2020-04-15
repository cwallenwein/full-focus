'use strict';

console.log('background running');

// when the extension is installed, show everything
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ active: false })
    chrome.storage.sync.set({
        settings: {
            youtube: {
                homepage:{
                    hide: false,
                    id: undefined
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
            }
        }
    })
})

chrome.browserAction.onClicked.addListener(toggleStatus)

function toggleStatus(tab) {
    chrome.storage.sync.get('active', function (data) {
        var status = data.active;
        // toggle status
        status = !status
        //update icon
        chrome.browserAction.setIcon({ path: status + ".png" });
        //save update to chrome
        chrome.storage.sync.set({ active: status });
        //update current page if it is in pages
        if (checkURL(tab.url)) {
            let msg = {
                type: false,
                url: tab.url,
                active: status,
                firstTime: false //this page was open before, the toggle button was just pressed
            }
            chrome.tabs.sendMessage(tab.id, msg)
        }
    });
}

// send message to content-script whether elements have to be hidden or not
// maybe you could speed this up if the message was only sent if stuff should be hidden
// however this might not work because some elements are hidden from the start
// hiding elements from the beginning has to be done, because otherwise you would see /n
// recommendations for a short period of time as long as the website hasn't loaded completely
chrome.tabs.onUpdated.addListener(sendStatus)

function sendStatus(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        if (checkURL(tab.url)) {
            chrome.storage.sync.get('active', function (data) {
                let msg = {
                    type: false,
                    url: tab.url,
                    active: data.active,
                    firstTime: true //this page was just opended for the first time
                }
                chrome.tabs.sendMessage(tab.id, msg)
            })
        }
    }
}

var pages = new Array("https://www.youtube.com/")

function checkURL(url) {
    //return (pages.indexOf(url) != -1)
    //console.log("checking " + url)
    //console.log("returning " + url.startsWith(pages[0]))
    return url.startsWith(pages[0])
}