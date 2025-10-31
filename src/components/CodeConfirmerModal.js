import React, { useState, useRef, useEffect } from "react";
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Clock,
  ShieldCheck
} from "lucide-react";
import "./css/CodeConfirmerModal.css";

const CodeConfirmerModal = ({ isOpen, onClose, onVerify, phoneNumber }) => {
  const [code, setCode] = useState(["", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      // Réinitialiser le code quand la modale s'ouvre
      setCode(["", "", ""]);
      setError("");
      setSuccess("");
      setIsVerifying(false);
      setTimeLeft(0);
      
      // Focus sur le premier input avec un léger délai
      if (inputRefs.current[0]) {
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 300);
      }
    }
  }, [isOpen]);

  // Timer pour le renvoi de code
  useEffect(() => {
    if (timeLeft === 0 || !isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isOpen]);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");
    setSuccess("");

    // Passer à l'input suivant si un chiffre est saisi
    if (value !== "" && index < 2) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }

    // Soumettre automatiquement si tous les chiffres sont saisis
    if (index === 2 && value !== "" && newCode.every(digit => digit !== "")) {
      setTimeout(() => handleVerify(), 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 10);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const numbers = pasteData.replace(/\D/g, "").slice(0, 3);
    
    if (numbers.length === 3) {
      const newCode = numbers.split("");
      setCode(newCode);
      setTimeout(() => {
        inputRefs.current[2]?.focus();
      }, 10);
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 3) {
      setError("Veuillez saisir les 3 chiffres du code de vérification");
      return;
    }

    setIsVerifying(true);
    setError("");
    setSuccess("");

    try {
      // Simulation de la vérification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onVerify) {
        await onVerify(verificationCode);
      }
      
      setSuccess("Code vérifié avec succès !");
      setTimeout(() => {
        setIsVerifying(false);
        if (onClose) onClose();
      }, 1500);
      
    } catch (err) {
      setError(err.message || "Code incorrect. Veuillez réessayer.");
      setIsVerifying(false);
      
      // Réinitialiser les champs en cas d'erreur
      setCode(["", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  };

  const handleResendCode = () => {
    if (timeLeft > 0) return;
    
    setError("");
    setSuccess("Code renvoyé avec succès !");
    setCode(["", "", ""]);
    setTimeLeft(30);
    
    // Refocus sur le premier input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    
    // Ici, vous ajouteriez la logique pour renvoyer le code
    console.log("Code renvoyé");
    
    // Effacer le message de succès après 3 secondes
    setTimeout(() => setSuccess(""), 3000);
  };

  // Fermer la modale en cliquant à l'extérieur
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isVerifying) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          <ShieldCheck size={24} />
          Vérification du Numéro
        </h2>
        
        <div className="modal-description">
          Nous avons envoyé un code de vérification à 3 chiffres au{" "}
          <span className="phone-number">{phoneNumber}</span>
        </div>

        {/* Contenu principal */}
        <div className={`modal-content ${isVerifying ? 'hidden' : ''}`}>
          <div className="code-inputs-container">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                className={`code-input ${digit ? "filled" : ""}`}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                autoComplete="one-time-code"
                disabled={isVerifying}
                aria-label={`Chiffre ${index + 1} du code de vérification`}
              />
            ))}
          </div>

          {error && false && (
            <div className="error-message" role="alert">
              <XCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="success-message" role="status">
              <CheckCircle size={18} />
              {success}
            </div>
          )}

          <button 
            className="verify-button" 
            onClick={handleVerify}
            disabled={code.join("").length !== 3 || isVerifying}
            aria-label="Vérifier le code"
          >
            <CheckCircle size={18} />
            Vérifier le Code
          </button>

          <div className="resend-code">
            <span>Vous n'avez pas reçu le code ?</span>
            {!(timeLeft > 0) && 
              <button 
              className="resend-link" 
              onClick={handleResendCode}
              disabled={timeLeft > 0 || isVerifying}
              aria-label={timeLeft > 0 ? `Renvoyer le code dans ${timeLeft} secondes` : "Renvoyer le code"}
            >
              <RotateCcw size={14} />
              {timeLeft > 0 ? `Renvoyer (${timeLeft}s)` : "Renvoyer le code"}
            </button>
            }
          </div>

          {timeLeft > 0 && (
            <div className="timer-container">
              <Clock size={14} />
              <span>Prochain envoi dans </span>
              <span className="timer">{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Loader de vérification */}
        {isVerifying && (
          <div className="verification-loader">
            <div className="loader-spinner" aria-label="Vérification en cours"></div>
            <div className="loader-text">Vérification en cours...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeConfirmerModal;