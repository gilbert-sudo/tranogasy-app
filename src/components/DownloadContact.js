import React from 'react';

const DownloadContact = () => {
  const downloadVCard = () => {
    const vCardData = `
      BEGIN:VCARD
      VERSION:3.0
      FN:Tranogasy Gilbert.T
      TEL;TYPE=cell:0345731293
      EMAIL:gilbert@tranogasy.mg
      END:VCARD
    `;

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'tranogasy.vcf';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={downloadVCard}>Download Contact</button>
  );
};

export default DownloadContact;
