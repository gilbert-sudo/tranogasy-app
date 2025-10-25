import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PhoneNumberInput from "../components/PhoneNumberInput";

import { useSignup } from "../hooks/useSignup";

import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Key, User } from "lucide-react";

import { Link, useLocation } from "wouter";
import Swal from "sweetalert2";

const SignUpPage = () => {
  const { signup, generateRandomCode, isLoading, error, bootstrapClassname } =
    useSignup();

  const [username, setUsername] = useState("");
  const [location, setLocation] = useLocation("");
  const [phone, setPhone] = useState("");
  const email = "";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const signupWaitlist = useSelector((state) => state.signup);

  const handlePhoneNumberInput = (e) => {
    // Remove non-numeric characters before updating state
    const numericValue = e.target.value.replace(
      /\D/g,
      ""
    );
    setPhone(numericValue);
  };

  // Render the main content
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Generate a random number of 4 characters
    const confirmationCode = await generateRandomCode();
    await signup(
      username,
      email,
      phone,
      password,
      password,
      confirmationCode
    );
  };

  useEffect(() => {
    const pageLoader = async () => {
      if (signupWaitlist) {
        console.log(location);
        setLocation(`/signupverification`);
      }
    };
    pageLoader();
  }, [signupWaitlist]);

  useEffect(() => {
    if (isLoading) {
      // Display the alert
      Swal.fire({
        imageUrl: "images/verification.gif",
        imageHeight: 50, // Set a max height in pixels
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
    <div
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
      {/* Formes d’arrière-plan */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "120%",
          height: "570px",
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
          height: "270px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          clipPath: "ellipse(100% 70% at 100% 0%)",
          zIndex: 0,
        }}
      ></div>

      {/* Conteneur principal */}
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
        {/* Bouton retour */}
        <div
          onClick={() => window.history.back()}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            backgroundColor: "white",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#333"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
          </svg>
        </div>

        {/* Texte de bienvenue */}
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#ffffffff",
            marginTop: "100px",
            marginBottom: "40px",
            textAlign: "left",
            width: "100%",
            fontWeight: "700",
          }}
        >
          Chez toi, c’est ici sur TranoGasy !
        </h1>

        <form action="#" onSubmit={handleSubmit}>

          {/* Champ du mot de passe */}
          <div style={{ position: "relative", width: "100%", marginBottom: "20px" }}>
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
              <User size={20} />
            </span>
            <input
              type="text"
              placeholder="Choisissez un nom d'utilisateur."
              style={{
                width: "100%",
                padding: "15px 50px",
                border: "none",
                borderRadius: "9999px",
                backgroundColor: "#f0f0f0",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
              value={username}
              maxLength={50}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Champ du numéro de téléphone */}
          <PhoneNumberInput value={phone} onChange={handlePhoneNumberInput} />

          {/* Champ du mot de passe */}
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
              placeholder="Créer un mot de passe"
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

          {/* Bouton Se connecter */}
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
              S'inscrire
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

        {/* Liens du bas */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "auto",
            paddingBottom: "20px",
            marginBottom: "50px",
            fontSize: "0.8rem",
          }}
        >
          Si vous disposez déjà d'un compte, &nbsp;
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "#7cbd1e",
              fontWeight: "bold",
              borderBottom: "1px solid #7cbd1e",
              paddingBottom: "2px",
            }}
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
