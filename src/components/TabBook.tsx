import * as React from 'react';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import EmailForm from './EmailForm';
import { ConfigDataRespType, NotesType } from '../types';
import NotesForm from './NotesForm';
import { sendRequest } from '../utils/serviceCallersModule';

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

const tabNames = ["Generate Response", "Notes"];

export default function TabBook({ configData, url }: { configData: ConfigDataRespType, url: string }) {
    const [tabValue, setTabValue] = React.useState(0);
    const [notes, setNotes] = React.useState<NotesType[]>([]);

    const handleTabChange = (e: React.SyntheticEvent, newValue: number) => {
        e.preventDefault();
        setTabValue(newValue);
    };

    React.useEffect(() => {
        getNotesList();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [url]);

    React.useEffect(() => {
        if(notes && notes.length){
            setTabValue(1);
        } else {
            setTabValue(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [notes]);

    const getNotesList = async () => {
        try {
            const notesResponse = await sendRequest({
                method: "retrieveNotes",
                requestData: { url },
            });

            const notes = notesResponse.response;
            setNotes(notes);

        } catch (e) {
            console.error("An error occurred when retrieving email notes", e);
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tab Book">
                    <Tab label={tabNames[0]} {...a11yProps(0)} />
                    <Tab label={tabNames[1]} {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
                <EmailForm configData={configData} url={url} notes={notes} setNotes={setNotes} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <NotesForm url={url} notes={notes} setNotes={setNotes} />
            </TabPanel>
        </Box>
    );
}