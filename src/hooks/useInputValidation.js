import { useState } from "react";
import { VscError } from "react-icons/vsc";

function useInputValidation() {
  const [errorMessages, setErrorMessages] = useState({});

  // Validation functions
  const validateUsername = (username) => {
    let errorMessage = "";

    // Check maximum length
    if (username.length >= 50) {
      errorMessage =
        "Le nom d'utilisateur ne doit pas dépasser les 50 caractères.";
    }
    // Check for at least one letter
    else if (username.length > 0 && !/[a-zA-Z]/.test(username)) {
      errorMessage = "La saisie doit comporter au moins une lettre.";
    }

    return errorMessage;
  };
  const validateBio = (bio) => {
    let errorMessage = "";

    // Check maximum length
    if (bio.length >= 500) {
      errorMessage =
        "Votre bio ne doit pas dépasser les 500 caractères.";
    }

    return errorMessage;
  };

  const validatePhoneNumber = (phoneNumber) => {
    let errorMessage = "";

    // Define a list of valid prefixes
    const validPrefixes = ["032", "033", "034", "038"];

    // Check if phone number contains only digits and has a length of 10
    const phoneRegex = /^\d{10}$/;
    if (!phoneNumber) {
      errorMessage = "Le numéro de téléphone ne doit pas être vide.";
    }
    if (phoneNumber.length > 0 && !phoneRegex.test(phoneNumber)) {
      errorMessage = "Le numéro de téléphone doit contenir 10 chiffres.";
    }
    // Check if phone number starts with a valid prefix
    const startsWithValidPrefix = validPrefixes.some((prefix) =>
      phoneNumber.startsWith(prefix)
    );
    if (phoneNumber.length > 2 && !startsWithValidPrefix) {
      errorMessage =
        "Le numéro de téléphone doit commencer par 032, 033, 034 ou 038.";
    }

    return errorMessage;
  };

  // Add more validation functions as needed

  // Validation function that sets the error message for an input field
  const validate = (fieldName, value) => {
    let errorMessage = "";

    // Call the appropriate validation function based on the field name
    if (fieldName === "username") {
      errorMessage = validateUsername(value);
    } else if (fieldName === "bio") {
      errorMessage = validateBio(value);
    } else if (fieldName === "phone") {
      errorMessage = validatePhoneNumber(value);
    }

    // Update error messages state
    setErrorMessages((prevErrorMessages) => ({
      ...prevErrorMessages,
      [fieldName]: errorMessage,
    }));

    // Return the error message
    return errorMessage;
  };

  // Function to render error display for a specific field
  const renderError = (field) => {
    const errorMessage = errorMessages[field];
    if (errorMessage) {
      return (
        <div className="m-1">
          <div className="error-line" /> {/* The error red line */}
          <small className="text-danger">
            <strong>
              <VscError />
            </strong>{" "}
            {errorMessage}
          </small>
        </div>
      );
    }
    return null;
  };

  return { errorMessages, validate, renderError };
}

export default useInputValidation;
