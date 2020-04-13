// here we need a receiver, when the popup is opened
// and a sender, when the popup is updated

// sends a message to background.js requesting all settings whenever the popup is opened
chrome.runtime.sendMessage(
    {method: "getSettings"},
    function(response){
        var response = response
        console.log(response)
        document.getElementById("homepage").checked = response.settings_youtube.hideHomepage;
        document.getElementById("comments").checked = response.settings_youtube.hideComments;
        document.getElementById("playlists").checked = response.settings_youtube.hidePlaylists;
        document.getElementById("recommendations").checked = response.settings_youtube.hideRecommendations;
    }
)

/*document.addEventListener("DOMContentLoaded", function () {

    var form = document.forms["form"];

    var actions = new Array()

    form.querySelectorAll("input").forEach(
        checkbox => {
            checkbox.addEventListener('click', event => {
                checkbox.
            })
        }
    )
}, false);
*/