import React, { useState } from 'react';

const SignupForm = () => {
  const [confirmationCode, setConfirmationCode] = useState('');

  const generateRandomCode = () => {
    const min = 100;
    const max = 999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
  };

  const handleSignup = () => {
    // Generate a random number of 4 characters
    const code = generateRandomCode();
    setConfirmationCode(code);
  };

  return (
    <div>
      {/* Your signup form here */}
      <button onClick={handleSignup}>Generate Confirmation Code</button>

      {/* Display the confirmation code to the user */}
      {confirmationCode && <p>Confirmation Code: {confirmationCode}</p>}
    </div>
  );
};

export default SignupForm;
