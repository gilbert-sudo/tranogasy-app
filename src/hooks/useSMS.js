export const useSMS = () => {
  const sendSMS = async (phone_number, message) => {
    // Remove the leading "0" from the phone number
    const phoneNumberWithoutLeadingZero = phone_number.replace(/^0+/, "");

    // Add the madagascar country code "+261" at the beginning of the phone number
    // const formattedPhoneNumber = "+261" + phoneNumberWithoutLeadingZero;

    let apiKey = process.env.REACT_APP_BEFIANA_API_KEY;

    const json = await fetch("https://api.befiana.cloud/api/smsko/v1/send/", {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phoneNumberWithoutLeadingZero,
        message,
      }),
    });

    const response = await json.json();
  };
  return { sendSMS };
};
