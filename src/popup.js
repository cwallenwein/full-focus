// request all settings from storage when popup is opened
chrome.storage.sync.get('settings', function(response){
    console.log(response)
    var settings = response.settings.youtube
    for(var key in settings){
        document.getElementById(key).checked = settings[key]
    }
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