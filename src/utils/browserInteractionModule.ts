import { REACT_MSG_METHODS } from "./constants";

export function getSelectedText(): Promise<string> {
    return new Promise((resolve) => {
        chrome.tabs &&
            chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true,
                },
                (tabs) => {
                    chrome.tabs.sendMessage(
                        tabs[0].id || 0,
                        { method: REACT_MSG_METHODS.getSelection },
                        (response: string) => {
                            resolve(response);
                        }
                    );
                }
            );
    });
}
