import React, { useState } from "react";

const TikTokDescription = ({ description }) => {
  const [expanded, setExpanded] = useState(false);

  const maxChars = 130; // ~2 lines on most phones
  const shouldTruncate = description.length > maxChars;
  const visibleText = shouldTruncate
    ? description.slice(0, maxChars).trim()
    : description;

  return (
    <p
      style={{
        fontSize: 13,
        color: "#f0f0f0",
        marginBottom: 6,
        lineHeight: 1.4,
      }}
    >
      {!expanded ? (
        <>
          {visibleText}
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
          {description}{" "}
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
