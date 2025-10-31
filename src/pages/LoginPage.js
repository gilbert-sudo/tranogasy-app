import { useState, useEffect } from "react";
import { useLocation } from "wouter";

import PhoneNumberInput from "../components/PhoneNumberInput";

import { useLogin } from "../hooks/useLogin";
import { useModal } from "../hooks/useModal";

import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Key } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { showModal, hideModal } = useModal();
  const { login, isLoading, error, bootstrapClassname } = useLogin();

  const handlePhoneNumberInput = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setPhoneNumber(numericValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(phoneNumber, password);
  };

  // Modern Loader Component
  const LoadingOverlay = () => {
    if (!isLoading) return null;

    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          backdropFilter: "blur(5px)",
          borderRadius: "inherit",
        }}
      >
        {/* Animated Logo/Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#7cbd1e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            animation: "pulse 2s infinite ease-in-out",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        {/* Loading Text */}
        <p
          style={{
            fontSize: "1.1rem",
            color: "#333",
            fontWeight: "500",
            marginBottom: "15px",
          }}
        >
          En train de vérifier
        </p>

        {/* Animated Dots */}
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#7cbd1e",
                animation: `bounce 1.4s infinite ease-in-out ${dot * 0.16}s`,
              }}
            />
          ))}
        </div>

        {/* CSS Animations */}
        <style>
          {`
            @keyframes pulse {
              0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(124, 189, 30, 0.4);
              }
              50% {
                transform: scale(1.05);
                box-shadow: 0 0 0 10px rgba(124, 189, 30, 0);
              }
              100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(124, 189, 30, 0);
              }
            }

            @keyframes bounce {
              0%, 80%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
              }
              40% {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}
        </style>
      </div>
    );
  };

  return (
    <div
      className="login-page"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "97dvh",
        backgroundColor: "white",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
        position: "relative",
        paddingTop: "50px",
      }}
    >
      {/* Loading Overlay - Now positioned relative to login-page */}
      <LoadingOverlay />

      {/* Rest of your existing JSX remains the same */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "250px",
          backgroundColor: "#7cbd1e",
          clipPath: "ellipse(100% 70% at 0% 0%)",
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: "250px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          clipPath: "ellipse(100% 70% at 100% 0%)",
          zIndex: 0,
        }}
      ></div>

      {/* Main container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "20px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "400px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Welcome text */}
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#333",
            marginTop: "100px",
            marginBottom: "40px",
            textAlign: "left",
            width: "100%",
            fontWeight: "700",
          }}
        >
          Bon retour chez TranoGasy !
        </h1>

        <form action="#" onSubmit={handleSubmit}>
          {/* Phone number input */}
          <PhoneNumberInput value={phoneNumber} onChange={handlePhoneNumberInput} />

          {/* Password input */}
          <div style={{ position: "relative", width: "100%", marginBottom: "40px" }}>
            <span
              style={{
                position: "absolute",
                left: "15px",
                bottom: "15px",
                alignItems: "center",
                cursor: "pointer",
                display: "flex",
                padding: "2px",
              }}
            >
              <Key size={20} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              style={{
                width: "100%",
                padding: "15px 50px",
                border: "none",
                borderRadius: "9999px",
                backgroundColor: "#f0f0f0",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
              value={password}
              maxLength={30}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                bottom: "15px",
                fontSize: "1rem",
                color: "#999",
                alignItems: "center",
                cursor: "pointer",
                display: "flex",
                padding: "2px",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && (
            <>
              <br></br>
              <div className={bootstrapClassname}>
                <small>{error}</small>
              </div>
            </>
          )}

          {/* Login button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: "50px",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Se connecter
            </span>
            <button
              type="submit"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#7cbd1e",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0px 5px 15px rgba(124, 189, 30, 0.4)",
                flexShrink: 0,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="white"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Bottom links */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "auto",
            paddingBottom: "20px",
            marginBottom: "50px",
          }}
        >
          <h6
            onClick={() => showModal("signup")}
            style={{
              color: "#7cbd1e",
              fontWeight: "bold",
              fontSize: "0.9rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Créer un compte
          </h6>
          <h6
            onClick={() => {
              hideModal();
              setLocation("/password-recovery/");
            }}
            style={{
              fontWeight: "bold",
              fontSize: "0.9rem",
              color: "#000",
              cursor: "pointer",
            }}
          >
            Mot de passe oublié ?
          </h6>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;