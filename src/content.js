'use strict';

// TODO fix search bar showing when user goes on yt/watch, clicks on yt logo and goes back one page
// TODO try with checking if last url differs from current url
// TODO try with css-file for each element to hide
// TODO also fix tabs in the background when settings were changed

// TODO block autoplay

// TODO fix space being added under video when extension is activated


chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, sender, sendResponse) {
    console.log(message)

    handleFirstTime(message)

    // TODO modify switch-case statement so it doesn't has to change when new functionality is added
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
        let allElementsOnWebsite = instructions[website]
        for (let element in allElementsOnWebsite) {
            if (allElementsOnWebsite[element].check(location.href)) {
                if (allElementsOnWebsite[element].firstTime != undefined) {
                    allElementsOnWebsite[element].firstTime()
                }
            }
        }
    }
}

function showAll() {
    let website = "youtube"
    let allElementsOnWebsite = instructions[website]
    for (let element in allElementsOnWebsite) {
        if (allElementsOnWebsite[element].check(location.href)) {
            allElementsOnWebsite[element].hide.false()
        }
    }
}

function hideAll() {
    let website = "youtube"
    let allElementsOnWebsite = instructions[website]
    chrome.storage.sync.get('settings', function (response) {
        for (let element in allElementsOnWebsite) {
            if (allElementsOnWebsite[element].check(location.href)) {
                let setting = response.settings[website][element].hide
                let instructionElement = allElementsOnWebsite[element]
                instructionElement.hide[setting]()
            }
        }
    })
}

function showOne(key) {
    // how do I differentiate between the current website given by getLocation()
    // and the website from the instructions
    let website = "youtube"
    let element = instructions[website][key]
    if (element != undefined) {
        element.hide.false()
    }
}

function hideOne(key) {
    let website = "youtube"
    chrome.storage.sync.get('active', function (response) {
        if (response.active) {
            if (instructions[website][key].check(location.href)) {
                instructions[website][key].hide.true()
            }
        }
    })

}


const checking = {
    general: (url) => url.startsWith("https://www.youtube.com/"),
    homepage: (url) => (url == "https://www.youtube.com/" || url.startsWith("https://www.youtube.com/#")),
    watch: (url) => url.startsWith("https://www.youtube.com/watch")
}

// always disable hiding an element when leaving the page
const instructions = {
    youtube: {
        homepage: {
            check: checking.general,
            hide: {
                true: function () {
                    if (checking.homepage(location.href)) {
                        var url = chrome.runtime.getURL("searchbar.css");
                        document.getElementById("identification").href = url
                        console.log("yes searchbar")
                    } else {
                        document.getElementById("identification").href = "(unknown)"
                        console.log("no searchbar 1")
                    }
                },
                false: function () {
                    console.log("no searchbar 2")
                    document.getElementById("identification").href = "(unknown)"
                },
            },
            firstTime: function () {
                console.log("add searchbar.css")
                var url = chrome.runtime.getURL("searchbar.css");
                var link = document.createElement("link");
                link.id = "identification"
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = url;
                document.head.appendChild(link)
            }
        },
        comments: {
            check: checking.watch,
            hide: {
                true: function () {
                    let current = document.getElementById("comments")
                    current.style.display = "none";
                },
                false: function () {
                    let current = document.getElementById("comments")
                    current.style.display = "block";
                }
            }
        },
        playlists: {
            check: checking.watch,
            hide: {
                true: function () {
                    let current = document.getElementById("playlist")
                    current.style.display = "none"
                },
                false: function () {
                    // TODO check if there even is a playlist on that page
                    // if there is no playlist but flex is enabled this could result in a minor bug
                    let current = document.getElementById("playlist")
                    current.style.display = "flex"
                }
            }
        },
        recommendations: {
            check: checking.watch,
            hide: {
                true: function () {
                    let current = document.getElementById("related")
                    current.style.display = "none"
                },
                false: function () {
                    let current = document.getElementById("related")
                    current.style.display = "block"
                }
            }
        },
        merch: {
            check: checking.watch,
            hide: {
                true: function () {
                    let current = document.getElementById("merch-shelf")
                    current.style.display = "none"
                },
                false: function () {
                    let current = document.getElementById("merch-shelf")
                    current.style.display = "block"
                }
            }
        }
    }
}