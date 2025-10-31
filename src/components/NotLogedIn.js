import { Link } from "wouter";
import { useImage } from "../hooks/useImage";
import { useModal } from "../hooks/useModal";


const NotLogedIn = () => {
  const { notLogedInImg } = useImage();
  const { showModal } = useModal();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "97dvh",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "25px",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "auto",
          minHeight: "80dvh",
          padding: "0rem 1.5rem 2rem 1.5rem",
        }}
      >
        <div>
          <h3
            style={{
              fontFamily:
                '"Poppins", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: "bold",
              color: "#000",
              marginBottom: "0.5rem",
              fontSize: "clamp(1.3rem, 2vw, 1.6rem)",
            }}
          >
            Bienvenue sur TranoGasy !
          </h3>
          <p
            style={{
              color: "#585d62",
              fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
              marginBottom: "1.5rem",
            }}
          >
            Connectez-vous ou créez votre compte gratuitement pour accéder à
            cette fonctionnalité.
          </p>
        </div>

        <img
          src={notLogedInImg()}
          alt="Connexion requise"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "45dvh",
            borderRadius: "15px",
            objectFit: "contain",
            margin: "1.5rem 0",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <button
            type="button"
            onClick={() => showModal("login")}
            className="btn btn-outline-dark"
            style={{
              borderRadius: "9999px",
              padding: "15px 0",
              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
              fontFamily:
                '"Poppins", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => showModal("signup")}
            className="btn"
            style={{
              background: "#7cbd1e",
              border: "2px solid #7cbd1e",
              color: "#fff",
              borderRadius: "9999px",
              padding: "15px 0",
              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
              fontFamily:
                '"Poppins", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "#6aa619")
            }
            onMouseOut={(e) => (e.currentTarget.style.background = "#7cbd1e")}
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotLogedIn;
