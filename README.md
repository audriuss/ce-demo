# Chrome Extension for Kids
A Google Chrome extension is nothing more or less than a collections of JS, HTML CSS and other asset files bundled into zip and renamed to .crx

## Extension components
* Manifest (JSON) - **REQUIRED**
* Content Script (JS)
* Background Script (JS)
* UI Elements: 
    * Icon
    * Tooltip
    * Popup (HTML + JS + CSS)
    * Omnibox
    * Context Menu
* Commands (keyboard shortcuts)
* Options Page

## Let's build an Extension "The Red Painter"

This guide contains only 4 steps. If you lost during the process you can always check already made extension inside this repo.

### Step 1 - Create `manifest.json`

The Manifest gives browser information about the extension, such as entry files and permissions that extension might use. This is only required file. 

Inside manifest you need to define name, description, icons, version and manifest version. Don't forget to put icons alongside manifest. You can use your own or copy from this repo. Manifest example:
``` json
{
    "manifest_version": 2,
    "name": "The Red Painter",
    "version": "0.0.1",
    "description": "It changes page background to red",
    "icons": {
        "16": "icons/16.png",
        "48": "icons/48.png",
       "128": "icons/128.png" 
    }
}
```

### Step 2 - Create a Popup

The Popup UI loads simple html file. Let's create html containing simple button which will trigger an action, `popup.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="assets/helvetica.css">
    <style>
      .container {
        width: 100px;
      }
    </style>
  </head>
  <body>
      <div class="container">
        <button id="makeRed">Make red</button>
      </div>
  </body>
  <script src="popup.js"></script>
</html>

```

Content Security Policy does not allow inline javascript, so you have to put your javascript in a .js file and include it in HTML (`<script src="popup.js"></script>`). An extension's files can be referred using a relative URL, just as files in an ordinary HTML page.

Let's create `popup.js` which will query active tab and send message to a content script using `chrome.tabs` API (https://developer.chrome.com/extensions/tabs#method-query). P.S. `Chrome` is accessible globally inside extension context.

```javascript
document.getElementById("makeRed").addEventListener("click", makePageRed);

function makePageRed() {
    chrome.tabs.query({currentWindow: true, active: true}, 
        tabs => {
            const activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "makeRed"});
        }
    )
}

```
The script uses `chrome.tabs` API, which needs special permissions, so we need to declare it inside `manifest.json` as follows:

``` json
"permissions": [
    "tabs"
],
```

Finally, we need to tell Chrome about our popup, it's defined as browser action inside `manifest.json`:

``` json
"browser_action": {
    "default_popup": "popup.html"
},
```

### Step 3 - Create a Content Script
The content script contains JavaScript that executes in the contexts of a page that has been loaded into the browser. Scripts can read and modify the DOM of web pages the browser visits.

Let's create a `content.js` script which listens to popup messages and changes the page background color. 

```javascript
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
```

Content Scripts can be programmatically or declaratively injected to the page. Let's use declarative way and define it inside `manifest.json` as follows (for more info: https://developer.chrome.com/extensions/content_scripts#declaratively):
```json
"content_scripts": [
    {
        "matches": ["<all_urls>"],
        "js": [ "content.js"]
    }
],
```

### Step 4 - Voila! Let's test it
1) Open `chrome://extension` in Chrome
2) Make sure you have turned on "Developer Mode" on right upper corner
3) Click "Load unpacked" on left upper corner
4) Select the extension folder
5) Extension's icon should appear
6) Visit some site and paint it red!
