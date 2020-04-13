// here we need a receiver, when the popup is opened
// and a sender, when the popup is updated

// sends a message to background.js requesting all settings whenever the popup is opened
chrome.runtime.sendMessage(
    {method: "getSettings"},
    function(resonse){
        console.log(resonse)
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