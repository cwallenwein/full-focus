'use strict';

var pages = new Array("https://www.youtube.com/")

console.log('background running');

// when the extension is installed, show everything
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
        // toggle status
        status = !status
        //update icon
        chrome.browserAction.setIcon({path: status + ".png"});
        //save update to chrome
        chrome.storage.sync.set({
            show: status, function(){
                console.log(status)
            }
        });
        //update current page if it is in pages

    });
};

// toggle when clicking on the extension icon
chrome.browserAction.onClicked.addListener(
    function(tab){
        toggle()
        sendInfo(tab)
    });

toggle();

// send message to content-script whether elements have to be hidden or not
// maybe you could speed this up if the message was only sent if stuff should be hidden
// however this might not work because some elements are hidden from the start
// hiding elements from the beginning has to be done, because otherwise you would see /n
// recommendations for a short period of time as long as the website hasn't loaded completely
//chrome.webNavigation.onHistoryStateUpdated.addListener(sendInfo)
//chrome.webNavigation.onHistoryStateUpdated.addListener(sendInfo)
chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab){
        if(changeInfo.status === 'complete'){
            sendInfo(tab)
        }
        
    })

function sendInfo(tab){
    if(pages.indexOf(tab.url) != -1){
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