import React, { useEffect, useState } from "react";
import "./MyForm.css";
import { Button, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import MyFormInput from "./MyFormInput";
import MyRBGroup from "./MyRBGroup";
import MyDialog from "./MyDialog";

import { pasteText as pasteTextOrig } from "../utils/browserInteractionModule";
import { ConfigDataRespType, IconTypes } from "../types";
import { STATE_NAME, REACT_MSG_METHODS, MODAL_STATES, BUTTON_OPTIONS } from "../utils/constants";
import MySelect from "./MySelect";

export default function MyForm({ configData }: { configData: ConfigDataRespType }) {
    const [field1Val, setField1Val] = useState<string>("");
    const [field2Val, setField2Val] = useState<string>("");
    const [showModal, setShowModal] = useState<string>(MODAL_STATES.none);
    const [emailMessage, setEmailMessage] = useState<string>("");
    const [modalFailMsg, setModalFailMsg] = useState<string>("");
    const [contactMeWhen, setContactMeWhen] = useState<string>("");
    const [closingMessage, setClosingMessage] = useState<string>("");

    useEffect(() => {
        setContactMeWhen(configData.WHEN_OPTIONS[0]);
        setClosingMessage(configData.CLOSING_MESSAGE[0]);
    }, [configData]);

    const pasteText = async (stateName: string) => {
        const response = await pasteTextOrig();
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
            .replace("$when$", contactMeWhen)
            .replace("$field2$", field2Val ? `at ${field2Val}` : "")
            .replace("$closing$", closingMessage);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();

        if (!field1Val || !contactMeWhen || !closingMessage) {
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
            case STATE_NAME.contactMeWhen:
                setContactMeWhen(event.target.value);
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
        setContactMeWhen(configData.WHEN_OPTIONS[0]);
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
            <MyFormInput label={`${configData.FIELD1_NAME} *`} icon={IconTypes.field1Icon} helperText={`Paste ${configData.FIELD1_NAME} here`}
                stateName={STATE_NAME.field1} onClick={pasteText} value={field1Val}
                onChange={handleChange}
            />
            {configData.FIELD2_NAME &&
                <MyFormInput label={configData.FIELD2_NAME} icon={IconTypes.field2Icon} helperText={`Paste ${configData.FIELD2_NAME} here`}
                    stateName={STATE_NAME.field2} onClick={pasteText} value={field2Val}
                    onChange={handleChange}
                />
            }
            {configData.WHEN_OPTIONS.length < 5 ?
                <MyRBGroup label="When Should You Be Contacted *"
                    options={configData.WHEN_OPTIONS} onChange={handleChange} stateName={STATE_NAME.contactMeWhen}
                    value={contactMeWhen}
                /> :
                <MySelect label="When Should You Be Contacted *"
                    options={configData.WHEN_OPTIONS} onChange={handleChange} stateName={STATE_NAME.contactMeWhen}
                    value={contactMeWhen}
                />
            }
            {configData.CLOSING_MESSAGE.length < 5 ?
                <MyRBGroup label="Closing Message *"
                    options={configData.CLOSING_MESSAGE} onChange={handleChange} stateName={STATE_NAME.closingMessage}
                    value={closingMessage}
                /> :
                <MySelect label="Closing Message *"
                    options={configData.CLOSING_MESSAGE} onChange={handleChange} stateName={STATE_NAME.closingMessage}
                    value={closingMessage}
                />
            }

            <Button variant="contained" color="success" endIcon={<SendIcon />} onClick={handleSubmit}
                sx={{ padding: "2px 4px", display: "flex", alignItems: "center" }}>
                Generate Email
            </Button>
        </Stack >
    );
}
