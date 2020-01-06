//In chrome apps, Content Security Policy does not allow inline javascript. So you have to put your javascript in a .js file and include it in your HTML.
// Link to CSP https://developer.chrome.com/extensions/contentSecurityPolicy
document.getElementById("makeRed").addEventListener("click", makePageRed);

function makePageRed() {
    chrome.tabs.query({currentWindow: true, active: true}, 
        tabs => {
            const activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "makeRed"});
        }
    )
}
