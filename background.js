'use strict';

console.log('background running');

// show everything right after the extension was installed
chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.sync.set({
        show: true, function(){
            console.log('Show everything on YouTube')
        }
    })
})

// function to toggle hiding stuff or showing everthing
function toggle(){
    chrome.storage.sync.get('show', function(data){
        var status = data.show;
        //update icon
        chrome.browserAction.setIcon({path: status + ".png"});
        // toggle status
        status = !status
        //update to chrome
        chrome.storage.sync.set({
            show: status, function(){
                console.log(status)
            }
        });
    });
};

// toggle when clicking on the extension icon
chrome.browserAction.onClicked.addListener(toggle);
toggle();

// send message to content-script whether elements have to be hidden or not
// maybe you could speed this up if the message was only sent if stuff should be hidden
// however this might not work because some elements are hidden from the start
// hiding elements from the beginning has to be done, because otherwise you would see /n
// recommendations for a short period of time as long as the website hasn't loaded completely
//chrome.webNavigation.onHistoryStateUpdated.addListener(sendInfo)
//chrome.webNavigation.onHistoryStateUpdated.addListener(sendInfo)
chrome.tabs.onUpdated.addListener(sendInfo)

function sendInfo(tabId, changeInfo, tab){
    if(changeInfo.status === 'complete' && tab.url != "chrome://newtab/"){
        chrome.storage.sync.get('show', function(data){
            let msg = {
                url: tab.url,
                show: data.show
            }
            chrome.tabs.sendMessage(tab.id, msg)
            console.log(tab.url)
        })
    }
}