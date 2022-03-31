"use strict";

console.log("This is the content script!");

const box = document.createElement("div");
box.style.cssText = "position:absolute;width:50px;height:50px;background:#FF0000;z-index:5000";

document.body.insertBefore(box, document.body.firstChild);
