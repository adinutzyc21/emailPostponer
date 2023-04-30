
import { Box } from '@mui/material';
import ButtonAppBar from './ButtonAppBar';
import TabBook from './TabBook';
import { useEffect, useState } from 'react';
import { REACT_MSG_METHODS } from '../utils/constants';
import { ConfigDataRespType } from '../types';

export default function MainApp() {
    const [configData, setConfigData] = useState<ConfigDataRespType>({
        EMAIL_TEMPLATE: "",
        WHEN_OPTIONS: [],
        CLOSING_MESSAGE: [],
        FIELD1_NAME: "",
        FIELD2_NAME: "",
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        chrome.tabs && chrome.tabs.query({
            active: true,
            currentWindow: true
        }, tabs => {
            chrome.tabs.sendMessage(
                tabs[0].id || 0,
                { method: REACT_MSG_METHODS.getData },
                (configData) => {
                    if (configData) {
                        console.log("Loading data", configData);
                        setConfigData(configData);
                    }
                }
            );
        });
    }

    return (
        <Box>
            <ButtonAppBar reloadConfig={getData} />
            <TabBook configData={configData} />
        </Box>
    );
}