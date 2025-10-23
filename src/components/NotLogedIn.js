import { useLocation, Link } from "wouter";
import { useImage } from "../hooks/useImage";

const NotLogedIn = () => {
  const [location, setLocation] = useLocation();
  const { notLogedInImg } = useImage();

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
            maxHeight: "45vh",
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
          <Link
            to="/login"
            className="btn"
            style={{
              background: "#fff",
              border: "2px solid #242424",
              borderRadius: "9999px",
              padding: "15px 0",
              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
              fontFamily:
                '"Poppins", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 600,
              color: "#242424",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "#f2f2f2")
            }
            onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
          >
            Se connecter
          </Link>

          <Link
            to="/signup"
            className="btn"
            style={{
              background: "#7cbd1e",
              border: "2px solid #242424",
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
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotLogedIn;
