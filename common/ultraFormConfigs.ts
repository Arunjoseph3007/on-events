import {
  TUltraFormFeild,
  TUltraFormFeildType,
} from "../frontend/components/common/UltraForm";
import type { TEventType } from "../src/db/schema";

export const UltraFormConfigOf: Record<TEventType, TUltraFormFeild[]> = {
  "discord:send-message": [
    {
      label: "message",
      type: TUltraFormFeildType.String,
      helperText: "Message To be sent on Discord channel",
      initialValue: "",
      isMultiple: false,
      placeholder: "Hey Django",
      required: true,
    },
  ],
  "gsheet:append-row": [
    {
      label: "rows",
      type: TUltraFormFeildType.String,
      helperText: "An array of text to be appended to the sheet",
      initialValue: [["", ""]],
      isMultiple: true,
      placeholder: "John Doe",
      required: true,
    },
  ],
  "gmail:send-mail": [
    {
      label: "to",
      type: TUltraFormFeildType.String,
      helperText: "The Gmail id to which the mail must be sent",
      initialValue: "",
      isMultiple: false,
      placeholder: "john.doe@gmail.com",
      required: true,
    },
    {
      label: "from",
      type: TUltraFormFeildType.String,
      helperText: "The Gmail id from which the mail must be sent",
      initialValue: "",
      isMultiple: false,
      placeholder: "john.sender@gmail.com",
      required: true,
    },
    {
      label: "subject",
      type: TUltraFormFeildType.String,
      helperText: "The subject of the mail",
      initialValue: "",
      isMultiple: false,
      placeholder: "Resignation Letter",
      required: true,
    },
    {
      label: "content",
      type: TUltraFormFeildType.Multiline,
      helperText: "The conetnt of the mail",
      initialValue: "",
      isMultiple: false,
      placeholder: "Resignation Letter",
      required: true,
    },
  ],
};
