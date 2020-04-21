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



// TODO only enable hiding elements when on the page as stated in check
// disable all that are not on the check page
const instructions = {
    youtube: {
        homepage: {
            check: checking.homepage,
            hide: {
                true: function () {
                    document.getElementById("stylesheetSearchbar").disabled = false
                },
                false: function () {
                    document.getElementById("stylesheetSearchbar").disabled = true
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
                    let current = document.getElementById("comments")
                    current.style.display = "none";
                    console.log("no comments")
                },
                false: function () {
                    let current = document.getElementById("comments")
                    current.style.display = "block";
                    console.log("show comments")
                }
            }
        },
        playlists: {
            check: checking.watch,
            hide: {
                true: function () {
                    let current = document.getElementById("playlist")
                    current.style.display = "none"
                    console.log("no playlists")
                },
                false: function () {
                    // TODO check if there even is a playlist on that page
                    // if there is no playlist but flex is enabled this could result in a minor bug
                    let current = document.getElementById("playlist")
                    current.style.display = "flex"
                    console.log("show playlists")
                }
            }
        },
        recommendations: {
            check: checking.watch,
            hide: {
                true: function () {
                    let current = document.getElementById("related")
                    current.style.display = "none"
                    console.log("no recommendations")
                },
                false: function () {
                    let current = document.getElementById("related")
                    current.style.display = "block"
                    console.log("show recommendations")
                }
            }
        },
        merch: {
            check: checking.watch,
            hide: {
                true: function () {
                    let current = document.getElementById("merch-shelf")
                    current.style.display = "none"
                    console.log("no merch")
                },
                false: function () {
                    let current = document.getElementById("merch-shelf")
                    current.style.display = "block"
                    console.log("show merch")
                }
            }
        }
    }
}