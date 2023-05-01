import { SyntheticEvent, useEffect, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";

import MyFormInput from "./MyFormInput";

import { getEmailURLInfo } from "../utils/browserInteractionModule";
import { STATE_NAME } from "../utils/constants";
import { ContentPaste, Add } from "@mui/icons-material";
import { sendRequest } from "../utils/serviceCallersModule"
import NotesTable from "./NotesTable";
import { NotesType } from "../types";

export default function NotesForm() {
    const [notes, setNotes] = useState<NotesType[]>([]);
    const [newNote, setNewNote] = useState<string>("");
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        pasteURL();
    }, []);

    useEffect(() => {
        getNotesList();
    }, [url]);

    const pasteURL = async () => {
        const response = await getEmailURLInfo();
        setUrl(response);
    }


    const handleSubmit = (event: any) => {
        // event.preventDefault();

        // if (!field1Val || !contactMeAround || !closingMessage) {
        //     setModalFailMsg("Fields marked with * are required! You can paste them directly from the email if you want.");
        //     setShowModal(MODAL_STATES.failure);
        //     return;
        // }
        // chrome.tabs && chrome.tabs.query({
        //     active: true,
        //     currentWindow: true
        // }, tabs => {
        //     chrome.tabs.sendMessage(
        //         tabs[0].id || 0,
        //         { method: REACT_MSG_METHODS.checkEmailPage },
        //         (resp) => {
        //             if (resp) {
        //                 setShowModal(MODAL_STATES.success);
        //                 setEmailMessage(createEmail());
        //             } else {
        //                 setModalFailMsg("Can't generate email. You don't seem have the email you want to reply to open.");
        //                 setShowModal(MODAL_STATES.failure);
        //             }
        //         }
        //     );
        // });
    }

    const getNotesList = async () => {
        try {
            const notesResponse = await sendRequest({
                method: "retrieveNotes",
                requestData: { url },
            });

            setNotes(notesResponse.response);
        } catch (e) {
            console.error("An error occurred when retrieving person notes", e);
        }
    }

    return (
        <Stack spacing={2}>
            <MyFormInput label={"URL"} required={true} helperText={"URL of the email"}
                stateName={STATE_NAME.url} value={url} onChange={(event: SyntheticEvent) => setUrl((event.target as HTMLInputElement).value)}
                endIconBtn={<ContentPaste />} onClick={pasteURL}
            />

            <div>
                <TextField
                    id="outlined-textarea"
                    label="Add a Note"
                    multiline
                    rows={2}
                    minRows={2}
                    value={newNote}
                    fullWidth
                    onChange={(event: SyntheticEvent) => setNewNote((event.target as HTMLInputElement).value)}
                    sx={{
                        background: "white",
                        textarea: {
                            resize: "both",
                        }
                    }}

                />
                <Button fullWidth variant="contained" endIcon={<Add />}>Add Note</Button>
            </div>

            <NotesTable rows={notes} />

        </Stack >
    );
}

