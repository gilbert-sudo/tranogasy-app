import { useLocation, Link } from "wouter";
import { FiUser } from "react-icons/fi";

const NotLogedIn = () => {
  const [location, setLocation] = useLocation();

  function refreshPage() {
    setLocation("/login");
    console.log(location);
  }

  return (
    <>
      <div className="container mt-5 pt-5 justify-content-center align-items-center no-internet-connection">
        <center>
          <img
            className="img-fluid"
            style={{ maxHeight: "50vh", borderRadius: "15px" }}
            src="images/not-loged.png"
            alt="Pas de connexion Internet"
          />
        </center>
        <center>
          {" "}
          <p style={{ fontFamily: "Roboto, sans-serif" }}>
            Connectez-vous ou créez votre compte gratuitement pour accéder à
            cette fonctionnalité.
          </p>
          <Link
            to="/login"
            style={{ borderRadius: "15px" }}
            className="btn btn-success text-white"
            onClick={refreshPage}
          >
            <FiUser /> Se connecter
          </Link>
        </center>
      </div>
    </>
  );
};

export default NotLogedIn;
