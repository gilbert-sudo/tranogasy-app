import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PhoneNumberInput from "../components/PhoneNumberInput";
import CodeConfirmerModal from "../components/CodeConfirmerModal";
import LoadingOverlay from "../components/LoadingOverlay";

import { useSignup } from "../hooks/useSignup";
import { useModal } from "../hooks/useModal";

import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Key, User } from "lucide-react";

import { useLocation } from "wouter";

const SignUpPage = () => {

  const modals = useSelector((state) => state.modals);
  const signupWaitlist = useSelector((state) => state.signup);

  const { signup, finalizeSignup, generateRandomCode, isLoading, error, bootstrapClassname } = useSignup();
  const { showModal, setCodeConfirmer } = useModal();

  const [username, setUsername] = useState("");
  const [location, setLocation] = useLocation("");
  const [phone, setPhone] = useState("");
  const email = "";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePhoneNumberInput = (e) => {
    // Remove non-numeric characters before updating state
    const numericValue = e.target.value.replace(
      /\D/g,
      ""
    );
    setPhone(numericValue);
  };

  const handleVerifyCode = async (code) => {

    const generatedCode = modals.codeConfirmer;
    const inputedcode = code;

    // Simulation d'une vérification API
    try {
      // Remplacez ceci par votre appel API réel
      await new Promise((resolve, reject) => {
        if (inputedcode === generatedCode) {
          finalizeSubmit();
          resolve();
        } else {
          reject();
        }
      });

      return true;
    } catch (error) {
      throw new Error("Code incorrect. Veuillez réessayer.");
    }
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

  // Render the main content
  const finalizeSubmit = async () => {
    await finalizeSignup({ username, email, phone, password });
    console.log("finalize the submition");
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

  return (
    <>
      <CodeConfirmerModal
        isOpen={modals.codeConfirmer}
        onClose={() => setCodeConfirmer(null)}
        onVerify={handleVerifyCode}
        phoneNumber={phone}
      />
      <div
        className="signup-page"
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
        {/* Loading Overlay - relative to signup-page */}
        {isLoading && <LoadingOverlay />}
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
            <h6
              onClick={() => showModal("login")}
              style={{
                borderBottom: "1px solid #7cbd1e",
                color: "#7cbd1e",
                fontWeight: "bold",
                paddingBottom: "2px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Se connecter
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
