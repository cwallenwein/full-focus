'use strict';

console.log('background running');

// when the extension is installed, show everything
chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.sync.set({show: true})
    // TODO also set standard settings for all pages
})

chrome.browserAction.onClicked.addListener(toggleStatus)

function toggleStatus(tab){
    chrome.storage.sync.get('show', function(data){
        var status = data.show;
        // toggle status
        status = !status
        //update icon
        chrome.browserAction.setIcon({path: status + ".png"});
        //save update to chrome
        chrome.storage.sync.set({show: status});
        //update current page if it is in pages
        if(checkURL(tab.url)){
            let msg = {
                url: tab.url,
                show: status,
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

function sendStatus(tabId, changeInfo, tab){
    if(changeInfo.status === 'complete'){
        if(checkURL(tab.url)){
            chrome.storage.sync.get('show', function(data){
                let msg = {
                    url: tab.url,
                    show: data.show,
                    firstTime: true //this page was just opended for the first time
                }
                chrome.tabs.sendMessage(tab.id, msg)
            })
        }
    }
}

var pages = new Array("https://www.youtube.com/")

function checkURL(url){
    //return (pages.indexOf(url) != -1)
    //console.log("checking " + url)
    //console.log("returning " + url.startsWith(pages[0]))
    return url.startsWith(pages[0])
}


// function to send settings for given page
// function to update settings for given pagen after a request was sent from popup.js