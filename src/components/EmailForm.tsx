import { SyntheticEvent, useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import { PersonAdd, Business, Send, ContentPaste } from '@mui/icons-material';

import MyFormInput from "./MyFormInput";
import SelectOrRbComp from "./SelectOrRbComp";
import MyDialog from "./MyDialog";

import { getSelectedText } from "../utils/browserInteractionModule";
import { NotesType } from "../types";
import { STATE_NAME, REACT_MSG_METHODS, MODAL_STATES, BUTTON_OPTIONS, MONTHS, AROUND_OPTIONS, CLOSING_MESSAGE_OPTIONS, SENDER_NAME, COMPANY_NAME, EMAIL_TEMPLATE } from "../utils/constants";
import ContactMeWhenComp from "./ContactMeWhenComp";
import { sendRequest } from "../utils/serviceCallersModule";

export default function EmailForm({ url, notes, setNotes }: { url: string,notes: NotesType[], setNotes: (notes: NotesType[]) => void }) {
    const [field1Val, setSenderNameVal] = useState<string>("");
    const [companyNameVal, setCompanyNameVal] = useState<string>("");
    const [showModal, setShowModal] = useState<string>(MODAL_STATES.none);
    const [emailMessage, setEmailMessage] = useState<string>("");
    const [modalFailMsg, setModalFailMsg] = useState<string>("");
    const [contactMeAround, setContactMeAround] = useState<string>("");
    const [contactMeMonth, setContactMeMonth] = useState<string>(MONTHS[new Date().getMonth()]);
    const [closingMessage, setClosingMessage] = useState<string>("");

    useEffect(() => {
        setContactMeAround(AROUND_OPTIONS[0]);
        setClosingMessage(CLOSING_MESSAGE_OPTIONS[0]);
    }, []);

    const pasteSelectedText = async (stateName: string) => {
        const response = await getSelectedText();
        switch (stateName) {
            case STATE_NAME.senderName:
                setSenderNameVal(response.text);
                break;
            case STATE_NAME.companyName:
                setCompanyNameVal(response.text);
                break;
        }
    }

    const createEmail = (): string => {
        return EMAIL_TEMPLATE.replace("$senderName$", field1Val)
            .replace("$around$", contactMeAround)
            .replace("$month$", contactMeMonth)
            .replace("$companyName$", companyNameVal)
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
            case STATE_NAME.senderName:
                setSenderNameVal((event.target as HTMLInputElement).value);
                break;
            case STATE_NAME.companyName:
                setCompanyNameVal((event.target as HTMLInputElement).value);
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
        setSenderNameVal("");
        setCompanyNameVal("");
        setContactMeAround(AROUND_OPTIONS[0]);
        setClosingMessage(CLOSING_MESSAGE_OPTIONS[0]);
        setShowModal(MODAL_STATES.none);
        setEmailMessage("");
        setModalFailMsg("");
    };

    return (
        <Stack spacing={2}>
            <MyDialog showModalState={showModal} handleClose={handleDialogClose}
                generatedEmailMessage={emailMessage} errorMsg={modalFailMsg}
            />
            <MyFormInput label={SENDER_NAME} startIcon={<PersonAdd />} required={true} helperText={`Paste ${SENDER_NAME} here`}
                stateName={STATE_NAME.senderName} endIconBtn={<ContentPaste />} onClick={pasteSelectedText} value={field1Val}
                onChange={handleChange}
            />
                <MyFormInput label={COMPANY_NAME} startIcon={<Business />} helperText={`Paste ${COMPANY_NAME} here`}
                    stateName={STATE_NAME.companyName} endIconBtn={<ContentPaste />} onClick={pasteSelectedText} value={companyNameVal}
                    onChange={handleChange}
                />
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
                options={CLOSING_MESSAGE_OPTIONS} onChange={handleChange} stateName={STATE_NAME.closingMessage}
                value={closingMessage}
                required={true}
            />
            <Button variant="contained" color="success" endIcon={<Send />} onClick={handleSubmit}>
                Generate Email
            </Button>
        </Stack >
    );
}
