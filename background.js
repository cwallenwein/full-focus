'use strict';

console.log('background running');

chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.sync.set({
        show: true, function(){
            console.log('Show everything on YouTube')
        }
    })
})

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

chrome.browserAction.onClicked.addListener(toggle);
toggle();



/*function buttonClicked(tab){
    
    toggle();

    let msg = {
        txt: status,
        url: tab.url
    }
    chrome.tabs.sendMessage(tab.id, msg);
}*/
