document.addEventListener("DOMContentLoaded", function () {

    var form = document.forms["form"];

    var actions = new Array()

    form.querySelectorAll("input").forEach(
        checkbox => {
            checkbox.addEventListener('click', event => {
                // checkbox
            })
        }
    )
}, false);