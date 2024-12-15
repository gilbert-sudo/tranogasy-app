import React from 'react';

const DialButton = () => {
  const phoneNumber = "0345189896";

  return (
    <a href={`tel:${phoneNumber}`}>
      <button>Call {phoneNumber}</button>
    </a>
  );
};

export default DialButton;
