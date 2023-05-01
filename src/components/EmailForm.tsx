import { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import { PersonAdd, Business, Send, ContentPaste } from '@mui/icons-material';

import MyFormInput from "./MyFormInput";
import SelectOrRbComp from "./SelectOrRbComp";
import MyDialog from "./MyDialog";

import { getEmailURLInfo, getSelectedText } from "../utils/browserInteractionModule";
import { ConfigDataRespType } from "../types";
import { STATE_NAME, REACT_MSG_METHODS, MODAL_STATES, BUTTON_OPTIONS, MONTHS, AROUND_OPTIONS } from "../utils/constants";
import ContactMeWhenComp from "./ContactMeWhenComp";

export default function EmailForm({ configData }: { configData: ConfigDataRespType }) {
    const [field1Val, setField1Val] = useState<string>("");
    const [field2Val, setField2Val] = useState<string>("");
    const [showModal, setShowModal] = useState<string>(MODAL_STATES.none);
    const [emailMessage, setEmailMessage] = useState<string>("");
    const [modalFailMsg, setModalFailMsg] = useState<string>("");
    const [contactMeAround, setContactMeAround] = useState<string>("");
    const [contactMeMonth, setContactMeMonth] = useState<string>(MONTHS[new Date().getMonth()]);
    const [closingMessage, setClosingMessage] = useState<string>("");
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        setContactMeAround(AROUND_OPTIONS[0]);
        setClosingMessage(configData.CLOSING_MESSAGE[0]);
    }, [configData]);

    const pasteURL = async () => {
        const response = await getEmailURLInfo();
        setUrl(response);
    }

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

    const handleChange = (event: any, stateName: string) => {
        switch (stateName) {
            case STATE_NAME.field1:
                setField1Val(event.target.value);
                break;
            case STATE_NAME.field2:
                setField2Val(event.target.value);
                break;
            case STATE_NAME.contactMeAround:
                setContactMeAround(event.target.value);
                break;
            case STATE_NAME.contactMeMonth:
                setContactMeMonth(event.target.value);
                break;
            case STATE_NAME.closingMessage:
                setClosingMessage(event.target.value);
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
                    (resp) => {
                        if (resp) {
                            setShowModal(MODAL_STATES.none);
                            resetForm();
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
                <MyFormInput label={configData.FIELD2_NAME} startIcon={<Business />} required={false} helperText={`Paste ${configData.FIELD2_NAME} here`}
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
            <Button variant="contained" color="success" endIcon={<Send />} onClick={handleSubmit}
                sx={{ padding: "2px 4px", display: "flex", alignItems: "center" }}>
                Generate Email
            </Button>
        </Stack >
    );
}
