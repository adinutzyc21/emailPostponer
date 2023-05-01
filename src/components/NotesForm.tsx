import { SyntheticEvent, useEffect, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";

import MyFormInput from "./MyFormInput";

import { getEmailURLInfo } from "../utils/browserInteractionModule";
import { STATE_NAME } from "../utils/constants";
import { ContentPaste, Add } from "@mui/icons-material";
import { sendRequest } from "../utils/serviceCallersModule"
import NotesTable from "./NotesTable";
import { NotesType } from "../types";

export default function NotesForm(props: { url: string, notes: NotesType[], setNotes: (notes: NotesType[]) => void }) {
    const [newNote, setNewNote] = useState<string>("");
    const [url, setUrl] = useState<string>(props.url);

    useEffect(() => {
        setUrl(props.url);
    }, [props.url]);

    const pasteURL = async () => {
        const response = await getEmailURLInfo();
        setUrl(response);
    }

    const handleSubmitNote = async (event: any) => {
        event.preventDefault();
        if (newNote !== "") {
            try {
                const newNoteResponse = await sendRequest({
                    method: "submitNote",
                    requestData: { url, "content": newNote },
                });
                if (newNoteResponse.response.content === newNote) {
                    props.setNotes([newNoteResponse.response, ...props.notes]);
                    setNewNote("");
                }
            } catch (e) {
                console.error("An error occurred when submitting email note", e);
            }
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
                    id="noteTextarea"
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
                <Button fullWidth variant="contained" endIcon={<Add />} onClick={handleSubmitNote}>Add Note</Button>
            </div>

            <NotesTable notes={props.notes} />

        </Stack >
    );
}

