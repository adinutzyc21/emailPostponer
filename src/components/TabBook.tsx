import * as React from 'react';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import MyForm from './MyForm';
import { ConfigDataRespType } from '../types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box >
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const tabNames = ["Generate Response", "Add Notes"];

export default function TabBook({ configData }: { configData: ConfigDataRespType }) {
    const [value, setValue] = React.useState(0);

    const handleChange = (e: React.SyntheticEvent, newValue: number) => {
        e.preventDefault();
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="Tab Book">
                    <Tab label={tabNames[0]} {...a11yProps(0)} />
                    <Tab label={tabNames[1]} {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <MyForm configData={configData} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                {tabNames[1]}
            </TabPanel>
        </Box>
    );
}