export function sendRequest(
    req: any
): Promise<{ response: any; message?: string }> {
    return new Promise((resolve, reject) => {
        chrome.tabs &&
            chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true,
                },
                (tabs) => {
                    chrome.tabs.sendMessage(
                        tabs[0].id || 0,
                        req,
                        (response) => {
                            if (
                                response &&
                                "Error" in response &&
                                response.Error !== ""
                            ) {
                                reject({
                                    message: response.Error,
                                });
                            } else {
                                resolve({ response });
                            }
                        }
                    );
                }
            );
    });
}
