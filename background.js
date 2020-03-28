console.log('background running');

chrome.browserAction.onClicked.addListener(buttonClicked)

let status = "show"

function toggle(){
    if (status === "show"){
        status = "hide"
    }else{
        status = "show"
    }
}

function buttonClicked(tab){
    
    toggle();

    let msg = {
        txt: status,
        url: tab.url
    }
    chrome.tabs.sendMessage(tab.id, msg);
}
