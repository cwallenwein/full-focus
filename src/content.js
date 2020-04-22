'use strict';
// TODO also fix tabs in the background when settings were changed

// TODO block autoplay

// TODO fix space being added under video when extension is activated

chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, sender, sendResponse) {
    console.log(message)

    handleFirstTime(message)

    // TODO modify switch-case statement so it doesn't have to change when new functionality is added
    // but before that check if new functionality is even needed
    switch (message.type) {
        case "hideAll":
            hideAll();
            break;
        case "showAll":
            showAll()
            break;
        case "hideOne":
            hideOne(message.element);
            break;
        case "showOne":
            showOne(message.element);
            break;
        default:
            console.log("I don't know this type of message")
    }

    return true
}

// check which url and which page the user is on
function getLocation() {
    for (var domain in instructions) {
        if (instructions[domain].check(location.href)) {
            break
        }
    }
    for (var page in instructions[domain].pages) {
        if (instructions[domain].pages[page].check(location.href)) {
            break
        }
    }
    return [domain, page]
}

function handleFirstTime(message) {
    if (message.firstTime) {
        let website = "youtube"
        let elementsOnWebsite = instructions[website]
        for (let element in elementsOnWebsite) {
            if (elementsOnWebsite[element].check(location.href)) {
                if (elementsOnWebsite[element].firstTime != undefined) {
                    elementsOnWebsite[element].firstTime()
                }
            }
        }
    }
}

function showAll() {
    let website = "youtube"
    let elementsOnWebsite = instructions[website]
    for (let elementName in elementsOnWebsite) {
        let element = elementsOnWebsite[elementName]

        if (element.check(location.href)) {
            element.hide.false()
        }
    }
}

function hideAll() {
    let website = "youtube"
    let elementsOnWebsite = instructions[website]

    chrome.storage.sync.get('settings', function (response) {

        for (let elementName in elementsOnWebsite) {
            let element = elementsOnWebsite[elementName]
            let setting = response.settings[website][elementName].hide

            if (element.check(location.href)) {
                element.hide[setting]()
            } else if (element.disableWhenNotOnPage != undefined) {
                if (element.disableWhenNotOnPage == true) {
                    element.hide.false()
                }
            }
        }
    })
}

function showOne(key) {
    let website = "youtube"
    let element = instructions[website][key]

    if (element != undefined) {
        if (element.check(location.href)) {
            element.hide.false()
        }
    }
}

function hideOne(key) {
    let website = "youtube"
    let element = instructions[website][key]

    chrome.storage.sync.get('active', function (response) {

        if (response.active && element != undefined) {
            if (element.check(location.href)) {
                element.hide.true()
            }
        }
    })

}


const checking = {
    general: (url) => url.startsWith("https://www.youtube.com/"),
    homepage: (url) => (url == "https://www.youtube.com/" || url.startsWith("https://www.youtube.com/#")),
    watch: (url) => url.startsWith("https://www.youtube.com/watch")
}

const instructions = {
    youtube: {
        homepage: {
            check: checking.homepage,
            hide: {
                true: function () {
                    let element = document.getElementById("stylesheetSearchbar")
                    if (element != null) {
                        element.disabled = false
                    }
                },
                false: function () {
                    let element = document.getElementById("stylesheetSearchbar")
                    if (element != null) {
                        element.disabled = true
                    }
                },
            },
            firstTime: function () {
                console.log("add searchbar.css")
                var url = chrome.runtime.getURL("searchbar.css");
                var link = document.createElement("link");
                link.id = "stylesheetSearchbar"
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = url;
                link.disabled = true
                document.head.appendChild(link)
            },
            disableWhenNotOnPage: true
        },
        comments: {
            check: checking.watch,
            hide: {
                true: function () {
                    let element = document.getElementById("comments")
                    element.style.display = "none";
                    console.log("no comments")
                },
                false: function () {
                    let element = document.getElementById("comments")
                    element.style.display = "block";
                    console.log("show comments")
                }
            }
        },
        playlists: {
            check: checking.watch,
            hide: {
                true: function () {
                    let element = document.getElementById("playlist")
                    element.style.display = "none"
                    console.log("no playlists 1")
                },
                false: function () {
                    // only set to flex if there should even be a playlist on that page
                    let element = document.getElementById("playlist")
                    if (element.hasAttribute("disable-upgrade") === false) {
                        element.style.display = "flex"
                        console.log("show playlists")
                    } else {
                        element.style.display = "none"
                        console.log("no playlists 2")
                    }


                }
            }
        },
        recommendations: {
            check: checking.watch,
            hide: {
                true: function () {
                    let element = document.getElementById("related")
                    element.style.display = "none"
                    console.log("no recommendations")
                },
                false: function () {
                    let element = document.getElementById("related")
                    element.style.display = "block"
                    console.log("show recommendations")
                }
            }
        },
        merch: {
            check: checking.watch,
            hide: {
                true: function () {
                    let element = document.getElementById("merch-shelf")
                    element.style.display = "none"
                    console.log("no merch")
                },
                false: function () {
                    let element = document.getElementById("merch-shelf")
                    element.style.display = "block"
                    console.log("show merch")
                }
            }
        },
        recommendationsAfterVideo: {
            check: checking.watch,
            hide: {
                true: function () {
                    let element = document.getElementsByClassName("ytp-endscreen-content")[0]
                    element.style.display = "none"
                    console.log("no recommendations after video")
                },
                false: function () {
                    let element = document.getElementsByClassName("ytp-endscreen-content")[0]
                    element.style.display = "block"
                    console.log("show recommendations after video")
                }
            }
        },
        autoplay: {
            check: checking.watch,
            hide: {
                true: function(){
                    let element = document.getElementById("toggle")
                    if(element != null){
                        if(element.getAttribute("aria-pressed")){
                            element.click()
                            console.log("disable autoplay")
                        }
                    }
                },
                false: function(){
                    let element = document.getElementById("toggle")
                    if(element != null){
                        if(element.getAttribute("aria-pressed")){
                            element.click()
                            console.log("enable autoplay")
                        }
                    }
                }
            }
        },
        chat: {
            check: checking.watch,
            hide: {
                true: function(){
                    let element = document.getElementById("chat")
                    if(element != null){
                        element.style.display = "none"
                    }
                },
                false: function(){
                    let element = document.getElementById("chat")
                    if(element != null){
                        element.style.display = "flex"
                    }
                }
            }
        }
    }
}