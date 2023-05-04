export const STATE_NAME = {
    senderName: "senderName",
    companyName: "companyName",
    contactMeAround: "contactMeAround",
    contactMeMonth: "contactMeMonth",
    closingMessage: "closingMessage",
    newNote: "newNote",
    url: "URL",
};

export const REACT_MSG_METHODS = {
    getSelection: "getSelection",
    replyToEmail: "replyToEmail",
    checkEmailPage: "checkEmailPage",
};

export const MODAL_STATES = {
    success: "success",
    failure: "failure",
    none: "none",
};

export const BUTTON_OPTIONS = {
    send: "send",
    cancel: "reset",
};

export const AROUND_OPTIONS = ["the beginning of ", "the end of ", "mid-"];

export const CLOSING_MESSAGE_OPTIONS = [
    "have a great day",
    "have a great evening",
    "have a great weekend",
    "have a great week"
];

export const SENDER_NAME = "Sender Name";
export const COMPANY_NAME = "Company Name";
export const EMAIL_TEMPLATE= `Hi $senderName$,<br/><br/>Thank you so much for reaching out! \
I am not going to be available until $around$$month$, but I would be excited to talk to you about \
$companyName$ closer to that time, if that works for you.<br/><br/>Thank you again, and $closing$!<br/>`;

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
