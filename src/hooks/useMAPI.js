import axios from "axios";

export const useMAPI = () => {
  const sendMapiSMS = async (phone_number, message) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/sms/send-sms`, { phone_number, message });
    return res.data;
  };
  return { sendMapiSMS };
};
