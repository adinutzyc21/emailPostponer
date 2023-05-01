import { SyntheticEvent, useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import { PersonAdd, Business, Send, ContentPaste } from '@mui/icons-material';

import MyFormInput from "./MyFormInput";
import SelectOrRbComp from "./SelectOrRbComp";
import MyDialog from "./MyDialog";

import { getSelectedText } from "../utils/browserInteractionModule";
import { ConfigDataRespType, NotesType } from "../types";
import { STATE_NAME, REACT_MSG_METHODS, MODAL_STATES, BUTTON_OPTIONS, MONTHS, AROUND_OPTIONS } from "../utils/constants";
import ContactMeWhenComp from "./ContactMeWhenComp";
import { sendRequest } from "../utils/serviceCallersModule";

export default function EmailForm({ configData, url, notes, setNotes }: { configData: ConfigDataRespType, url: string,notes: NotesType[], setNotes: (notes: NotesType[]) => void }) {
    const [field1Val, setField1Val] = useState<string>("");
    const [field2Val, setField2Val] = useState<string>("");
    const [showModal, setShowModal] = useState<string>(MODAL_STATES.none);
    const [emailMessage, setEmailMessage] = useState<string>("");
    const [modalFailMsg, setModalFailMsg] = useState<string>("");
    const [contactMeAround, setContactMeAround] = useState<string>("");
    const [contactMeMonth, setContactMeMonth] = useState<string>(MONTHS[new Date().getMonth()]);
    const [closingMessage, setClosingMessage] = useState<string>("");

    useEffect(() => {
        setContactMeAround(AROUND_OPTIONS[0]);
        setClosingMessage(configData.CLOSING_MESSAGE[0]);
    }, [configData]);

    const pasteSelectedText = async (stateName: string) => {
        const response = await getSelectedText();
        switch (stateName) {
            case STATE_NAME.field1:
                setField1Val(response.text);
                break;
            case STATE_NAME.field2:
                setField2Val(response.text);
                break;
        }
    }

    const createEmail = (): string => {
        return configData.EMAIL_TEMPLATE.replace("$field1$", field1Val)
            .replace("$around$", contactMeAround)
            .replace("$month$", contactMeMonth)
            .replace("$field2$", field2Val)
            .replace("$closing$", closingMessage);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();

        if (!field1Val || !contactMeAround || !closingMessage) {
            setModalFailMsg("Fields marked with * are required! You can paste them directly from the email if you want.");
            setShowModal(MODAL_STATES.failure);
            return;
        }
        chrome.tabs && chrome.tabs.query({
            active: true,
            currentWindow: true
        }, tabs => {
            chrome.tabs.sendMessage(
                tabs[0].id || 0,
                { method: REACT_MSG_METHODS.checkEmailPage },
                (resp) => {
                    if (resp) {
                        setShowModal(MODAL_STATES.success);
                        setEmailMessage(createEmail());
                    } else {
                        setModalFailMsg("Can't generate email. You don't seem have the email you want to reply to open.");
                        setShowModal(MODAL_STATES.failure);
                    }
                }
            );
        });
    }

    const handleChange = (event: SyntheticEvent, stateName: string) => {
        switch (stateName) {
            case STATE_NAME.field1:
                setField1Val((event.target as HTMLInputElement).value);
                break;
            case STATE_NAME.field2:
                setField2Val((event.target as HTMLInputElement).value);
                break;
            case STATE_NAME.contactMeAround:
                setContactMeAround((event.target as HTMLInputElement).value);
                break;
            case STATE_NAME.contactMeMonth:
                setContactMeMonth((event.target as HTMLInputElement).value);
                break;
            case STATE_NAME.closingMessage:
                setClosingMessage((event.target as HTMLInputElement).value);
                break;
        }
    }

    const handleDialogClose = (option: string) => {
        if (option === BUTTON_OPTIONS.send) {
            chrome.tabs && chrome.tabs.query({
                active: true,
                currentWindow: true
            }, tabs => {
                chrome.tabs.sendMessage(
                    tabs[0].id || 0,
                    { method: REACT_MSG_METHODS.replyToEmail, emailToSend: emailMessage },
                    async (resp) => {
                        if (resp) {
                            setShowModal(MODAL_STATES.none);
                            resetForm();
                            try {
                                const newNoteResponse = await sendRequest({
                                    method: "submitNote",
                                    requestData: { url, "content": `<b>Email Sent on ${(new Date()).toLocaleDateString()} at ${(new Date()).toLocaleTimeString()}:</b><br/><blockquote>${emailMessage}<blockquote>` },
                                });
                                setNotes([newNoteResponse.response, ...notes]);

                            } catch (e) {
                                console.error("An error occurred when submitting email note", e);
                            }
                        } else {
                            setShowModal(MODAL_STATES.failure);
                            setModalFailMsg("The email couldn't be generated. Please refresh and try again.");
                        }
                    }
                );
            });
        }
        else {
            setShowModal(MODAL_STATES.none);
        }
    }

    const resetForm = () => {
        setField1Val("");
        setField2Val("");
        setContactMeAround(AROUND_OPTIONS[0]);
        setClosingMessage(configData.CLOSING_MESSAGE[0]);
        setShowModal(MODAL_STATES.none);
        setEmailMessage("");
        setModalFailMsg("");
    };

    return (
        <Stack spacing={2}>
            <MyDialog showModalState={showModal} handleClose={handleDialogClose}
                generatedEmailMessage={emailMessage} errorMsg={modalFailMsg}
            />
            <MyFormInput label={configData.FIELD1_NAME} startIcon={<PersonAdd />} required={true} helperText={`Paste ${configData.FIELD1_NAME} here`}
                stateName={STATE_NAME.field1} endIconBtn={<ContentPaste />} onClick={pasteSelectedText} value={field1Val}
                onChange={handleChange}
            />
            {configData.FIELD2_NAME &&
                <MyFormInput label={configData.FIELD2_NAME} startIcon={<Business />} helperText={`Paste ${configData.FIELD2_NAME} here`}
                    stateName={STATE_NAME.field2} endIconBtn={<ContentPaste />} onClick={pasteSelectedText} value={field2Val}
                    onChange={handleChange}
                />
            }
            <ContactMeWhenComp label="When Should You Be Contacted"
                optionsRb={AROUND_OPTIONS}
                optionsSel={MONTHS}
                onChangeRb={handleChange}
                onChangeSel={handleChange}
                stateNameRb={STATE_NAME.contactMeAround}
                stateNameSel={STATE_NAME.contactMeMonth}
                valueRb={contactMeAround}
                valueSel={contactMeMonth}
                required={true}
            />
            <SelectOrRbComp label="Closing Message"
                options={configData.CLOSING_MESSAGE} onChange={handleChange} stateName={STATE_NAME.closingMessage}
                value={closingMessage}
                required={true}
            />
            <Button variant="contained" color="success" endIcon={<Send />} onClick={handleSubmit}>
                Generate Email
            </Button>
        </Stack >
    );
}
