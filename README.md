# emailPostponer
Chrome extension that auto-composes a reply email to ask for a follow-up at a later date

## Use The Extension
1. Clone the repo and cd into the directory
2. Install and build the extension (this might take a while):
    - `npm install`
    - `npm run build`
        - this should create a `"build"` folder in the extension folder - this is the extension code that needs to be loaded into Chrome
3. Load extension into Chrome by going to `chrome://extensions/`, turning developer mode on, and clicking `Load unpacked`. Select the `build` folder. The extension will now be available in the extension toolbar.

## Example
![email-postponer](https://user-images.githubusercontent.com/3579157/163103248-e4288c69-cb47-4927-a567-2b9f1408b658.gif)

## Features To Come
Config files to generate your own options!
