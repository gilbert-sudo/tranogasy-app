import React, { useState, useRef, useEffect } from "react";
import { MdVerifiedUser } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { resetAccountRecovery } from "../redux/redux";
import { useVerification } from "../hooks/useVerification";
import { useSMS } from "../hooks/useSMS";
import { useLocation } from "wouter";
import Swal from "sweetalert2";

const PasswordRecoveryVerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState(["", "", ""]);
  const [resendTimer, setResendTimer] = useState(30); // Countdown timer in seconds
  const [resendDisabled, setResendDisabled] = useState(false); // Disable the Resend button during the countdown

  const [error, setError] = useState(false);
  const [, setLocation] = useLocation();
  const { sendSMS } = useSMS();
  const { getUserByPhoneNumberForVerification, isLoading } = useVerification();

  const dispatch = useDispatch();

  const accountRecovery = useSelector((state) => state.accountRecovery);

  const inputRefs = useRef([]);

  const code = accountRecovery.verification.code;
  const phone = accountRecovery.user.phone;

  const handleInputChange = (e, index) => {
    const value = e.target.value.slice(0, 1); // Ensure only one character is kept
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);
  };

  const handleInputKeyUp = (e, index) => {
    const prevInput = inputRefs.current[index - 1];
    const nextInput = inputRefs.current[index + 1];

    if (e.key === "Backspace" && verificationCode[index] === "") {
      if (prevInput) {
        prevInput.focus();
      }
    } else if (verificationCode[index] !== "" && nextInput) {
      nextInput.focus();
    }
  };

  const handleKeyPress = (e) => {
    const charCode = e.charCode;
    if (charCode >= 48 && charCode <= 57) {
      // Allow digits 0-9
      return;
    }
    // Prevent input if the character is a special character (e.g., +, *, /)
    e.preventDefault();
  };

  const startResendTimer = () => {
    setResendDisabled(true); // Disable the Resend button
    const intervalId = setInterval(() => {
      setResendTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Reset the resend timer to 20 after 20 seconds
    setTimeout(() => {
      clearInterval(intervalId);
      setResendTimer(30);
      setResendDisabled(false); // Enable the Resend button
    }, 20000);
  };

  const handleResendCode = async () => {
    console.log("Resending verification code...");
    
    // send verification code to the user
    await sendSMS(
      phone,
      "Votre code de confirmation TranoGasy est le : " + code
    );

    startResendTimer(); // Start the resend timer
  };

  const handleSubmit = async () => {
    setError(false);
    const formattedCode = verificationCode.join(""); // Remove commas and get the verification code as a single string

    if (code === formattedCode) {
      //   await finalizeSignup(signupWaitlist);
      console.log("the code has been verified");
      getUserByPhoneNumberForVerification(phone);
    } else {
      setError(true);
      setTimeout(() => {
        setVerificationCode(["", "", ""]);
        inputRefs.current[0].focus();
      }, 1000);
      setTimeout(() => setError(false), 4500);
    }
  };

  const handleCancel = () => {
    dispatch(resetAccountRecovery());
    setLocation(`/password-recovery/${phone}`);
  };

  useEffect(() => {
    // console.log(accountRecovery);
    inputRefs.current[0].focus();
  }, []);

  useEffect(() => {
    if (isLoading) {
      // Display the alert
      Swal.fire({
        imageUrl: "images/verification.gif",
        html: `<p style={{ fontWeight: "400" }}> Vérification... </p>`,
        allowOutsideClick: false,
        showConfirmButton: false,
        customClass: {
          popup: "smaller-sweet-alert2",
        },
      });
    } else {
      // Close the alert when loading is complete
      Swal.close();
    }
  }, [isLoading]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            '\n  /* Import Google font - Roboto */\n * {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n }\nbody {\n  min-height: 100vh;\n  display: flex;\n  padding-top: 12vh;\n  justify-content: center;\n  background: #ccd1e0;\n}\n:where(.container, form, .input-field, header) {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n.container {\n  background: #fff;\n  max-width: 96%;\n  padding: 20px 30px;\n  border-radius: 12px;\n  row-gap: 10px;\n  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);\n}\n.container header {\n  height: 65px;\n  width: 65px;\n  background: #e0e3eb;\n  color: #fff;\n  font-size: 2.5rem;\n  border-radius: 50%;\n}\n.container h4 {\n  font-size: 1.25rem;\n  color: #333;\n  font-weight: 500;\n}\nform .input-field {\n  flex-direction: row;\n  column-gap: 10px;\n}\n.input-field input {\n  height: 45px;\n  width: 42px;\n  border-radius: 6px;\n  outline: none;\n  font-size: 1.125rem;\n  text-align: center;\n  border: 1px solid #c1bfbf;\n}\n.input-field input:focus {\n  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);\n}\n.input-field input::-webkit-inner-spin-button,\n.input-field input::-webkit-outer-spin-button {\n  display: none;\n}\nform button {\n  margin-top: 25px;\n  width: 100%;\n  color: #fff;\n  font-size: 1rem;\n  border: none;\n  padding: 9px 0;\n  cursor: pointer;\n  border-radius: 6px;\n  pointer-events: none;\n  background: #6e93f7;\n  transition: all 0.2s ease;\n}\nform button.active {\n  background: #4070f4;\n  pointer-events: auto;\n}\nform button:hover {\n  background: #0e4bf1;\n}\n\n',
        }}
      />
      <div className="container">
        <header className="text-center text-success">
          <MdVerifiedUser />
        </header>
        <h4 className="font-weight-bold">Le code de vérification</h4>
        <h6 className="font-weight-light text-center">
          Un code de vérification sera envoyé au{" "}
          <strong>
            <u>0{phone & phone} </u>
          </strong>
          dans quelques secondes. Veuillez saisir ce code de vérification à 3
          chiffres ci-dessous :
        </h6>
        <form action="#">
          <div className="input-field">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="number"
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyUp={(e) => handleInputKeyUp(e, index)}
                onKeyPress={handleKeyPress} // Add the onKeyPress event handler
                maxLength={1}
              />
            ))}
          </div>
        </form>
        <div className="d-flex">
          <button
            onClick={() => handleSubmit()}
            className="btn btn-success text-white w-50"
            style={{ borderRadius: "30px" }}
            disabled={verificationCode.join("").length < 3}
          >
            Vérifier
          </button>
          <button
            onClick={() => handleCancel()}
            className="btn btn-danger text-white w-50 ml-2"
            style={{ borderRadius: "30px" }}
          >
            Annuler
          </button>
        </div>
        {error && (
          <div className="alert alert-danger mt-2">
            <small>Code de confirmation incorrect</small>
          </div>
        )}
        <p className="d-flex text-center mt-2">
          <h6>
            {resendTimer > 0 && resendTimer !== 30 ? (
              `Code renvoyé (${resendTimer}s)`
            ) : (
              <u
                style={{ cursor: "pointer" }}
                onClick={() => handleResendCode()}
              >
                Non reçu! renvoyer le code
              </u>
            )}
          </h6>
        </p>
      </div>
    </>
  );
};

export default PasswordRecoveryVerificationPage;
