import React, { useState } from "react";
import InputMask from "react-input-mask";

import { useImage } from "../hooks/useImage";

import { Phone } from "lucide-react";

const PhoneNumberInput = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const { mgFlag } = useImage();

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {isFocused &&
        <span
          className="far p-2"
          style={{ minWidth: "max-content", position: 'absolute', transform: 'translateY(20%)' }}
        >
          <div className="d-flex align-items-center justify-content-centre">
            <img
              alt="Madagascar"
              style={{
                objectFit: "cover",
                width: "21px",
                height: "21px",
                borderRadius: "50%",
                marginLeft: '9px',
              }}
              src={mgFlag()}
            />
            <div>&nbsp; +261</div>
          </div>
        </span>
      }
      {!isFocused &&
          <span
            style={{
              position: 'absolute',
              left: '15px',
              bottom: '33px',
              alignItems: 'center',
              cursor: 'pointer',
              display: 'flex',
              padding: '2px',
            }}
          >
           <Phone size={20}/> 
          </span>
      }
      <InputMask
        mask="99 99 999 99"
        placeholder={isFocused ? "00 00 000 00" : "Votre numéro de téléphone"}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        maskChar={null}
      >
        {(inputProps) => (
          <input
            {...inputProps}
            style={{
              width: '100%',
              padding: isFocused ? '15px 20px 15px 87px' : '15px 20px 15px 50px',
              marginBottom: '20px',
              border: 'none',
              borderRadius: '9999px',
              backgroundColor: '#f0f0f0',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
            type="tel"
            required
          />
        )}
      </InputMask>
    </div>
  );
};

export default PhoneNumberInput;
