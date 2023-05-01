import { SelectedTextRespType } from "../types";
import { REACT_MSG_METHODS } from "./constants";

export function getSelectedText(): Promise<SelectedTextRespType> {
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
                        (response: SelectedTextRespType) => {
                            resolve(response);
                        }
                    );
                }
            );
    });
}

export function getEmailURLInfo(): Promise<string> {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0].url?.split("#")[1] || "");
        });
    });
}
