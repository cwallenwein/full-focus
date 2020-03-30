'use strict';

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    console.log(message)

    if (message.url === "https://www.youtube.com/") {
        toggleYouTubeHomepage(message)
    } else if (new RegExp("https:\/\/www\.youtube\.com\/watch.*").test(message.url)) {
        toggleYouTubeWatch(message)
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


function toggleYouTubeWatch(message) {
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
        document.getElementById("merch-shelf").style.display = "block";
    } else {
        document.getElementById("playlist").style.display = "none";
        document.getElementById("related").style.display = "none";
        document.getElementById("comments").style.display = "none";
        document.getElementById("merch-shelf").style.display = "none";
    }
}



function addShowCSS() {
    console.log("addShowCss")
    var url = chrome.runtime.getURL("show.css");
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    link.dataset.name = "show"
    document.head.appendChild(link)
}

function toggleCSS(message) {
    console.log("toggleCSS")
    var links = document.getElementsByTagName("link");
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
    background.classList.add("overlay");
    background.setAttribute("id", "background")

    // create form
    var form = document.createElement("form")
    form.classList.add("overlay");
    form.setAttribute("id", "form")

    // form.action = "#"
    //form.onsubmit = function(){
    // window.location.href  = "https://www.youtube.com/results?search_query=" + document.getElementById('searchBar').value
    //}

    // create input field
    var searchBar = document.createElement("input")
    searchBar.setAttribute("type", "text")
    searchBar.classList.add("overlay");
    searchBar.setAttribute("id", "searchBar")

    // create submit button
    var submitButton = document.createElement("div")
    //submitButton.setAttribute("type", "submit")
    submitButton.classList.add("overlay");
    submitButton.setAttribute("id", "submitButton")
    submitButton.onclick = function () {
        window.location.href = "https://www.youtube.com/results?search_query=" + document.getElementById('searchBar').value
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
    document.getElementById("background").style.zIndex = "2500";
    document.getElementById("form").style.zIndex = "2501"
    // disable scrolling
    document.body.style.overflowY = "hidden"

    // submit form on enter
    var searchBar = document.getElementById("searchBar");
    searchBar.addEventListener("keyup", submitOnEnter)
}



function hideSearchBar() {
    console.log("hideSearchBar")
    // remove background and form again
    document.getElementById("background").style.zIndex = "-10";
    document.getElementById("form").style.zIndex = "-10";

    // enable scrolling again
    document.body.style.overflowY = "auto"

    // disable submit form on enter
    var searchBar = document.getElementById("searchBar");
    searchBar.removeEventListener("keyup", submitOnEnter)
}

function submitOnEnter(){
    if (event.keyCode === 13) {
        event.preventDefault()
        document.getElementById("submitButton").click()
    }
}