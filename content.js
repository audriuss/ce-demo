chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.message === "makeRed") {
            makeRed();
        }
    }
);

function makeRed(){
    const body = document.getElementsByTagName("body")[0];
    body.style["background-color"] = "red"; 
}