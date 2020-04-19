'use strict';

// TODO fix search bar showing when user goes on yt/watch, clicks on yt logo and goes back one page
// TODO fix extension not working on startup

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

    /*chrome.storage.sync.get('settings', function (response) {

        var settings = response.settings.youtube

        if (location.href === "https://www.youtube.com/") {
            toggleYouTubeHomepage(message, settings)
        }else if (location.href.startsWith("https://www.youtube.com/")) {
            addShowCSS();
        }
    })*/
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

function handleFirstTime(message){
    if(message.firstTime){
        let [website, page] = getLocation()
        if(instructions[website].pages[page].firstTime != undefined){
            instructions[website].pages[page].firstTime()
        }else{
            //
        }
    }
}

function showAll() {
    let [website, page] = getLocation()
    console.log("showAll")
    console.log(instructions)
    console.log(instructions[website].pages[page])
    for (let elem in instructions[website].pages[page].elements) {
        console.log(elem)
        instructions[website].pages[page].elements[elem].hide.false()
    }
}

function hideAll() {
    let [locationWebsite, locationPage] = getLocation()
    chrome.storage.sync.get('settings', function (response) {
        for (let element in instructions[locationWebsite].pages[locationPage].elements) {
            let setting = response.settings[locationWebsite][element].hide
            let instructionsWebsite = instructions[locationWebsite]
            let instructionsPage = instructionsWebsite.pages[locationPage]
            let instructionElement = instructionsPage.elements[element]
            instructionElement.hide[setting]()
        }
    })
}

function showOne(key) {
    // how do I differentiate between the current website given by getLocation()
    // and the website from the instructions
    let [website, page] = getLocation()
    let element = instructions[website].pages[page].elements[key]
    if (element != undefined){
        element.hide.false()
    }
}

function hideOne(key) {
    let [website, page] = getLocation()
    chrome.storage.sync.get('active', function (response) {
        if (response.active) {
            instructions[website].pages[page].elements[key].hide.true()
        }
    })

}

const instructions = {
    youtube: {
        check: function (url) {
            return url.startsWith("https://www.youtube.com/")
        },
        pages: {
            homepage: {
                check: function (url) {
                    return (url == "https://www.youtube.com/") || (url.startsWith("https://www.youtube.com/#"))
                },
                elements: {
                    homepage: {
                        hide: {
                            true: function(){
                                hideSearchBar()
                            },
                            false: function(){
                                showSearchBar()
                            },
                        }
                    }
                },
                firstTime: function(){
                    addSearchBar()
                }
            },
            watch: {
                check: function (url) {
                    return url.startsWith("https://www.youtube.com/watch")
                },
                elements: {
                    comments: {
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
                        hide: {
                            true: function () {
                                let current = document.getElementById("playlist")
                                current.style.display = "none"
                            },
                            false: function () {
                                let current = document.getElementById("playlist")
                                current.style.display = "flex"
                            }
                        }
                    },
                    recommendations: {
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
                },
                firstTime: undefined//function () { }
            },
        }
    }
}



function toggleYouTubeHomepage(message) {
    console.log("YTHomepage")
    // add searchbar for the first time, after that only toggle it
    if (message.firstTime) {
        addSearchBar()
    }

    if (message.show) {
        hideSearchBar()
    } else {
        showSearchBar()
    }

    // add show.css directly after everything is loaded
    if (message.firstTime) { addShowCSS(); }
}

function addShowCSS() {
    console.log("addShowCss")
    var url = chrome.runtime.getURL("show.css");
    var link = document.createElement("ext_link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    link.dataset.name = "show"
    document.head.appendChild(link)
}

function toggleCSS(message) {
    console.log("toggleCSS")
    var links = document.getElementsByTagName("ext_link");
    var url = chrome.runtime.getURL("show.css");
    for (let link of links) {
        if (link.getAttribute("data-name") === "show") {
            if (message.show === true) {
                link.href = url;
            } else {
                link.href = undefined
            }
        }
    }
}

function addSearchBar() {
    console.log("addSearchBar")
    // create blank background
    var background = document.createElement("div");
    background.classList.add("ext_overlay");
    background.setAttribute("id", "ext_background")

    // create form
    var form = document.createElement("ext_form")
    form.classList.add("ext_overlay");
    form.setAttribute("id", "ext_form")

    // form.action = "#"
    //form.onsubmit = function(){
    // window.location.href  = "https://www.youtube.com/results?search_query=" + document.getElementById('ext_searchBar').value
    //}

    // create input field
    var searchBar = document.createElement("input")
    searchBar.setAttribute("type", "text")
    searchBar.classList.add("ext_overlay");
    searchBar.setAttribute("id", "ext_searchBar")

    // create submit button
    var submitButton = document.createElement("div")
    //submitButton.setAttribute("type", "submit")
    submitButton.classList.add("ext_overlay");
    submitButton.setAttribute("id", "ext_submitButton")
    submitButton.onclick = function () {
        window.location.href = "https://www.youtube.com/results?search_query=" + document.getElementById('ext_searchBar').value
    }
    submitButton.append(document.createTextNode("Go"))

    // add search bar and submit button to form
    form.appendChild(searchBar)
    form.appendChild(submitButton)

    // add form and background screen to body
    document.body.appendChild(background);
    document.body.appendChild(form)
}

function showSearchBar() {
    console.log("showSearchBar")
    // make background and form visible
    document.getElementById("ext_background").style.zIndex = "2500";
    document.getElementById("ext_form").style.zIndex = "2501"
    // disable scrolling
    document.body.style.overflowY = "hidden"

    // submit form on enter
    var searchBar = document.getElementById("ext_searchBar");
    searchBar.addEventListener("keyup", submitOnEnter)
}



function hideSearchBar() {
    console.log("hideSearchBar")
    // remove background and form again
    document.getElementById("ext_background").style.zIndex = "-10";
    document.getElementById("ext_form").style.zIndex = "-10";

    // enable scrolling again
    document.body.style.overflowY = "auto"

    // disable submit form on enter
    var searchBar = document.getElementById("ext_searchBar");
    searchBar.removeEventListener("keyup", submitOnEnter)
}

function submitOnEnter() {
    if (event.keyCode === 13) {
        event.preventDefault()
        document.getElementById("ext_submitButton").click()
    }
}

/*const instructions = {
    youtube: {
        homepage: {
            hide: {
                true: function () {
                    //
                },
                false: function () {
                    //
                }
            }
        },
        comments: {
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
            hide: {
                true: function () {
                    let current = document.getElementById("playlist")
                    current.style.display = "none"
                },
                false: function () {
                    let current = document.getElementById("playlist")
                    current.style.display = "flex"
                }
            }
        },
        recommendations: {
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
    }
}*/