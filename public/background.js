/* #region Allow extension to continue functioning after an upgrade, and to make it work immediately upon installation*/
chrome.runtime.onInstalled.addListener(async () => {
    for (const cs of chrome.runtime.getManifest().content_scripts) {
        for (const tab of await chrome.tabs.query({ url: cs.matches })) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: cs.js,
            });
        }
    }
    return true;
});
/* #endregion */

// Open the extension iframe when the extension button is clicked
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { method: "toggleExtension" });

    chrome.tabs.sendMessage(tab.id, {
        message: "urlChanged",
        url: tab.url.split("#")[1],
    });

    return true;
});

/* #region Handle messages from content scripts */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.message.method) {
        case "submitNote":
            fetchReq("PATCH", request.message.requestData, sendResponse);
            break;

        case "retrieveNotes":
            fetchReq("POST", request.message.requestData, sendResponse);
            break;
    }
    return true;
});

// Generic error handling method for all fetch calls
function handleErrors(response) {
    if (!response.ok) {
        throw Error(`${response.status}: ${response.statusText}`);
    }
    return response.json();
}

function fetchReq(method, reqData, sendResponse) {
    const options = {
        method,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Proxy-Connection": "Keep-Alive",
        },
        body: JSON.stringify(reqData),
    };

    const sendResp = sendResponse;

    fetch("http://127.0.0.1:5000/notes", options)
        .then(handleErrors)
        .then((response) => sendResp(response))
        .catch((e) => sendResp({ Error: e.message }));
}

// Listen for changing URLs by navigating inside GMail. Data gets sent to React app
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        chrome.tabs.sendMessage(tabId, {
            message: "urlChanged",
            url: changeInfo.url.split("#")[1],
        });
        return true;
    }
    return false;
});
