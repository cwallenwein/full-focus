// request all settings from storage when popup is opened
chrome.storage.sync.get('settings_youtube', function(response){
    document.getElementById("homepage").checked = response.settings_youtube.hideHomepage;
    document.getElementById("comments").checked = response.settings_youtube.hideComments;
    document.getElementById("playlists").checked = response.settings_youtube.hidePlaylists;
    document.getElementById("recommendations").checked = response.settings_youtube.hideRecommendations;
})


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