import React, { useState } from "react";
import Linkify from "linkify-react";

const TikTokDescription = ({ description }) => {
  const [expanded, setExpanded] = useState(false);

  const maxChars = 60; // ~3 lines on most phones
  const shouldTruncate = description.length > maxChars;
  const visibleText = shouldTruncate
    ? description.slice(0, maxChars).trim()
    : description;

  const options = {
    target: '_blank',
    rel: 'noopener noreferrer'
  };


  return (
    <p
      style={{
        fontSize: 13,
        color: "#f0f0f0",
        marginBottom: 6,
        lineHeight: 1.4,
        whiteSpace: "break-spaces",
        wordBreak: "break-word",
      }}
    >
      {!expanded ? (
        <>
          <Linkify options={options}>
            {visibleText}
          </Linkify>
          {shouldTruncate && (
            <>
              ...{" "}
              <span
                onClick={() => setExpanded(true)}
                style={{
                  color: "#ccc",
                  cursor: "pointer",
                  textDecoration: "underline",
                  pointerEvents: "auto",
                }}
              >
                voir plus
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <Linkify options={options}>
            {description}
          </Linkify>
          {" "}
          <span
            onClick={() => setExpanded(false)}
            style={{
              color: "#ccc",
              cursor: "pointer",
              textDecoration: "underline",
              pointerEvents: "auto",
            }}
          >
            voir moins
          </span>
        </>
      )}
    </p>
  );
};

export default TikTokDescription;
