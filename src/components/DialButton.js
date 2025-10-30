import React from 'react';

const GilbertAi = () => {
  const phoneNumber = "0345189896";

  return (
    <a href={`tel:${phoneNumber}`}>
      <button>Call {phoneNumber}</button>
    </a>
  );
};

export default GilbertAi;
