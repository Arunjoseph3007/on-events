import { ChevronRightIcon } from "@chakra-ui/icons";
import welcome from "../../src/mails/welcome";
import { useState } from "react";

type TEmailTemplate<TProps = any> = {
  (p: TProps): JSX.Element;
  PreviewProps: TProps;
};

const templateToComponent: Record<string, TEmailTemplate> = {
  welcome,
};

export default function EmailPreviewPage() {
  const [templateName, setTemplatename] = useState("");

  const Component = templateToComponent[templateName];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        height: "98vh",
        fontFamily: "Segoe UI",
      }}
    >
      <div
        style={{
          minWidth: "200px",
          borderRight: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "5px",
        }}
      >
        {Object.keys(templateToComponent).map((template) => (
          <button
            style={{
              background: "white",
              paddingBlock: "10px",
              textTransform: "capitalize",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onClick={() => setTemplatename(template)}
            key={template}
          >
            <span>{template}</span>
            <ChevronRightIcon boxSize={20} />
          </button>
        ))}
      </div>
      <div style={{ flex: "1" }}>
        {Component ? (
          <Component {...Component.PreviewProps} />
        ) : (
          <div
            style={{
              display: "flex",
            }}
          >
            <div
              style={{
                marginInline: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <h1 style={{ fontSize: "180px" }}>404</h1>
              <p style={{ fontSize: "20px" }}>
                Please select an email template to preview here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
