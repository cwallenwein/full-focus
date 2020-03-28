'use strict';

chrome.runtime.onMessage.addListener(gotMessage);


function gotMessage(message, sender, sendResponse){

    console.log(message)

    if(message.url === "https://www.youtube.com/") {
        if(message.txt === "hide"){
            
            // create blank screen
            var blank = document.createElement("div");
            blank.classList.add("overlay");
            blank.setAttribute("id", "blank")

            blank.style.zIndex = "2500";

            // create form
            var form = document.createElement("form")
            form.classList.add("overlay");
            form.setAttribute("id", "form")
            form.style.zIndex = "2501"
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
            submitButton.onclick = function(){
                window.location.href  = "https://www.youtube.com/results?search_query=" + document.getElementById('searchBar').value
            }
            submitButton.append(document.createTextNode("Go"))

            // add search bar and submit button to form
            form.appendChild(searchBar)
            form.appendChild(submitButton)

            // add form and blank screen to body
            document.body.appendChild(blank);
            document.body.appendChild(form)

            // disable scrolling
            document.body.style.overflowY = "hidden"

        }else{

            // remove blank screen again
            document.getElementById("blank").style.zIndex = "-10";
            document.getElementById("form").style.zIndex = "-10";
            


            // enable scrolling again
            document.body.style.overflowY = "auto"

            document.getElementById

        }    

    }else if(new RegExp("https:\/\/www\.youtube\.com\/watch.*").test(message.url)){
        if(message.txt === "hide"){
            document.getElementById("playlist").style.display = "none";
            document.getElementById("related").style.display = "none";
            document.getElementById("comments").style.display = "none";
            document.getElementById("merch-shelf").style.display = "none";
            
        }else{
            document.getElementById("playlist").style.display = "flex";
            document.getElementById("related").style.display = "block";
            document.getElementById("comments").style.display = "block";
            document.getElementById("merch-shelf").style.display = "block";
        }
        
    }

    
}

