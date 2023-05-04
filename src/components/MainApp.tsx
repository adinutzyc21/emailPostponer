
import { Box } from '@mui/material';
import ButtonAppBar from './ButtonAppBar';
import TabBook from './TabBook';
import { useState } from 'react';

export default function MainApp() {
    const [url, setUrl] = useState<string>("");

    chrome.runtime.onMessage.addListener(function (request) {
        if (request && request.message === "urlChanged") {
            setUrl(request.url);
        }
        return true;
    });

    return (
        <Box>
            <ButtonAppBar/>
            <TabBook url={url} />
        </Box>
    );
}