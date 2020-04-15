'use strict';

// TODO dictionary that stores all the elements that can be hidden for each url and sub-url + regex to detect it

chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, sender, sendResponse) {
    console.log(message)

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
        } else if (new RegExp("https:\/\/www\.youtube\.com\/watch.*").test(location.href)) {
            toggleYouTubeWatch(message, settings)
            //hiding.youtube.comments(settings.youtube.comments.hide)
            //hiding.youtube.playlists(settings.youtube.playlists.hide)
            //hiding.youtube.recommendations(settings.youtube.recommendations.hide)
        } else if (location.href.startsWith("https://www.youtube.com/")) {
            addShowCSS();
        }
    })*/
}


function showAll() {
    // TODO make this as universal as possible
    for (let elem in hiding.youtube.pages.watch.elements) {
        hiding.youtube.pages.watch.elements[elem].hide.false()
    }
}

function hideAll() {
    // TODO make this as universal as possible
    chrome.storage.sync.get('settings', function (response) {
        for (let elem in hiding.youtube.pages.watch.elements) {
            let setting = response.settings.youtube[elem].hide
            hiding.youtube.pages.watch.elements[elem].hide[setting]()
        }
    })
}

function showOne(key) {
    // TODO make this as universal as possible
    hiding.youtube.pages.watch.elements[key].hide.false()
}

function hideOne(key) {
    // TODO make this as universal as possible
    chrome.storage.sync.get('active', function(response){
        if(response.active){
            hiding.youtube.pages.watch.elements[key].hide.true()
        }
    })
    
}

const hiding = {
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
                    all: {
                        hide: {
                            true: function () {
                                //
                            },
                            false: function () {
                                //
                            }
                        }
                    }
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
                }
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


function toggleYouTubeWatch(message, settings) {
    console.log("YTWatch")
    // 2 options:
    // 1: only display white screen for YT homepage and not for YT watch
    // 2: add the line below
    if (message.firstTime) { addShowCSS(); }
    // the first recommended video is visible for a brief second before it is hidden
    // maybe this can be fixed easily, no priority though

    if (message.show) {
        document.getElementById("playlist").style.display = "flex";
        document.getElementById("related").style.display = "block";
        document.getElementById("comments").style.display = "block";
        //document.getElementById("merch-shelf").style.display = "block";
    } else {
        document.getElementById("playlist").style.display = "none";
        document.getElementById("related").style.display = "none";
        document.getElementById("comments").style.display = "none";
        //document.getElementById("merch-shelf").style.display = "none";
    }
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

/*const hiding = {
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