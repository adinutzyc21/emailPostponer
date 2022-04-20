import React from "react";
import "./MyForm.css";
import { Button, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { ButtonAppBar } from "./ButtonAppBar";
import MyFormInput from "./MyFormInput";
import MyRBGroup from "./MyRBGroup";
import MyDialog from "./MyDialog";

import { pasteText } from "../utils/browserInteractionModule";
import { IconTypes } from "../types";
import { STATE_NAME, REACT_MSG_METHODS, MODAL_STATES, BUTTON_OPTIONS } from "../utils/constants";
import MySelect from "./MySelect";

class MyForm extends React.Component<{},
    {
        field1Val: string,
        field2Val: string,
        contactMeWhen: string,
        closingMessage: string,
        showModal: string,
        emailMessage: string,
        modalFailMsg: string,
        configData: {
            EMAIL_TEMPLATE: string,
            WHEN_OPTIONS: Array<string>,
            CLOSING_MESSAGE: Array<string>,
            FIELD1_NAME: string,
            FIELD2_NAME: string,
        }
    }> {
    constructor(props: any) {
        super(props);
        this.state = {
            field1Val: "",
            field2Val: "",
            contactMeWhen: "",
            closingMessage: "",
            showModal: MODAL_STATES.none,
            emailMessage: "",
            modalFailMsg: "",
            configData: {
                EMAIL_TEMPLATE: "",
                WHEN_OPTIONS: [],
                CLOSING_MESSAGE: [],
                FIELD1_NAME: "",
                FIELD2_NAME: "",
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createEmail = this.createEmail.bind(this);
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        chrome.tabs && chrome.tabs.query({
            active: true,
            currentWindow: true
        }, tabs => {
            chrome.tabs.sendMessage(
                tabs[0].id || 0,
                { method: REACT_MSG_METHODS.getData, emailToSend: this.state.emailMessage },
                (configData) => {
                    if (configData) {
                        console.log("hello", configData);
                        this.setState({ configData });
                        this.setState({ contactMeWhen: configData.WHEN_OPTIONS[0] });
                        this.setState({ closingMessage: configData.CLOSING_MESSAGE[0] });
                    }
                }
            );
        });
    }

    async pasteText(stateName: string) {
        const response = await pasteText();
        switch (stateName) {
            case STATE_NAME.field1:
                this.setState({ field1Val: response.text });
                break;
            case STATE_NAME.field2:
                this.setState({ field2Val: response.text });
                break;
        }
    }

    createEmail(): string {
        return this.state.configData.EMAIL_TEMPLATE.replace("$field1$", this.state.field1Val)
            .replace("$when$", this.state.contactMeWhen)
            .replace("$field2$", this.state.field2Val ? `at ${this.state.field2Val}` : "")
            .replace("$closing$", this.state.closingMessage);
    }

    handleSubmit(event: any) {
        if (!this.state.field1Val || !this.state.contactMeWhen || !this.state.closingMessage) {
            this.setState({ modalFailMsg: "Fields marked with * are required! You can paste them directly from the email if you want." })
            this.setState({ showModal: MODAL_STATES.failure });
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
                        this.setState({ showModal: MODAL_STATES.success });
                        this.setState({ emailMessage: this.createEmail() });
                    } else {
                        this.setState({ modalFailMsg: "Can't generate email. You don't seem have the email you want to reply to open." })
                        this.setState({ showModal: MODAL_STATES.failure });
                    }
                }
            );
        });

        event.preventDefault();
    }

    handleChange(event: any, stateName: string) {
        switch (stateName) {
            case STATE_NAME.field1:
                this.setState({ field1Val: event.target.value });
                break;
            case STATE_NAME.field2:
                this.setState({ field2Val: event.target.value });
                break;
            case STATE_NAME.contactMeWhen:
                this.setState({ contactMeWhen: event.target.value });
                break;
            case STATE_NAME.closingMessage:
                this.setState({ closingMessage: event.target.value });
                break;
        }
    }

    handleDialogClose(option: string) {
        if (option === BUTTON_OPTIONS.send) {
            chrome.tabs && chrome.tabs.query({
                active: true,
                currentWindow: true
            }, tabs => {
                chrome.tabs.sendMessage(
                    tabs[0].id || 0,
                    { method: REACT_MSG_METHODS.replyToEmail, emailToSend: this.state.emailMessage },
                    (resp) => {
                        if (resp) {
                            this.setState({ showModal: MODAL_STATES.none });
                            this.resetForm();
                        } else {
                            this.setState({ showModal: MODAL_STATES.failure });
                            this.setState({ modalFailMsg: "The email couldn't be generated. Please refresh and try again." })
                        }
                    }
                );
            });
        }
        else {
            this.setState({ showModal: MODAL_STATES.none });
        }
    }

    resetForm() {
        this.setState({ field1Val: "" });
        this.setState({ field2Val: "" });
        this.setState({ contactMeWhen: this.state.configData.WHEN_OPTIONS[0] });
        this.setState({ closingMessage: this.state.configData.CLOSING_MESSAGE[0] });
        this.setState({ showModal: MODAL_STATES.none });
        this.setState({ emailMessage: "" });
        this.setState({ modalFailMsg: "" });
    };

    render() {
        return (
            <Stack spacing={2}>
                <ButtonAppBar refreshData={this.getData} />
                <MyDialog showModalState={this.state.showModal} handleClose={this.handleDialogClose.bind(this)}
                    generatedEmailMessage={this.state.emailMessage} errorMsg={this.state.modalFailMsg}
                />
                <MyFormInput label={`${this.state.configData.FIELD1_NAME} *`} icon={IconTypes.field1Icon} helperText={`Paste ${this.state.configData.FIELD1_NAME} here`}
                    stateName={STATE_NAME.field1} onClick={this.pasteText.bind(this)} value={this.state.field1Val}
                    onChange={this.handleChange.bind(this)}
                />
                {this.state.configData.FIELD2_NAME &&
                    <MyFormInput label={this.state.configData.FIELD2_NAME} icon={IconTypes.field2Icon} helperText={`Paste ${this.state.configData.FIELD2_NAME} here`}
                        stateName={STATE_NAME.field2} onClick={this.pasteText.bind(this)} value={this.state.field2Val}
                        onChange={this.handleChange.bind(this)}
                    />
                }
                {this.state.configData.WHEN_OPTIONS.length < 5 ?
                    <MyRBGroup label="When Should You Be Contacted *"
                        options={this.state.configData.WHEN_OPTIONS} onChange={this.handleChange.bind(this)} stateName={STATE_NAME.contactMeWhen}
                        value={this.state.contactMeWhen}
                    /> :
                    <MySelect label="When Should You Be Contacted *"
                        options={this.state.configData.WHEN_OPTIONS} onChange={this.handleChange.bind(this)} stateName={STATE_NAME.contactMeWhen}
                        value={this.state.contactMeWhen}
                    />
                }
                {this.state.configData.CLOSING_MESSAGE.length < 5 ?
                    <MyRBGroup label="Closing Message *"
                        options={this.state.configData.CLOSING_MESSAGE} onChange={this.handleChange.bind(this)} stateName={STATE_NAME.closingMessage}
                        value={this.state.closingMessage}
                    /> :
                    <MySelect label="Closing Message *"
                        options={this.state.configData.CLOSING_MESSAGE} onChange={this.handleChange.bind(this)} stateName={STATE_NAME.closingMessage}
                        value={this.state.closingMessage}
                    />
                }

                <Button variant="contained" color="success" endIcon={<SendIcon />} onClick={this.handleSubmit}
                    sx={{ padding: "2px 4px", display: "flex", alignItems: "center" }}>
                    Generate Email
                </Button>
            </Stack >
        );
    }
}

export default MyForm;