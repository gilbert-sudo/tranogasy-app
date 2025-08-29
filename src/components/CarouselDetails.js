import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "wouter";
import { FaHeart, FaPhoneAlt } from "react-icons/fa";
import { BsHeartFill } from "react-icons/bs";
import { ImLocation } from "react-icons/im";
import { useLike } from "../hooks/useLike";
import { useLogin } from "../hooks/useLogin";
import "./css/sweetalert.css";
//import user photo profil
import userProfile from "../img/user-avatar.png";
import useSound from "use-sound";

const CarouselDetails = ({ property, handleShowContact }) => {

  const [location, setLocation] = useLocation("");
  const { like, disLike } = useLike();
  const { notLogedPopUp } = useLogin();
  const [play] = useSound("sounds/Like Sound Effect.mp3");
  const [isliked, setIsliked] = useState(false);
  const user = useSelector((state) => state.user);
  const timer = useSelector((state) => state.timer.timer);

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short", // Use short month name
    day: "2-digit", // Use 2-digit day format
    timeZone: "Indian/Antananarivo",
  }).format(new Date(property.created_at));

  //click the like button
  const handleLike = async (e) => {
    e.preventDefault();
    if (user) {
      play();
      setIsliked(true);
      like(property);
    }
    if (!user) {
      notLogedPopUp();
    }
  };
  //click the disLike button
  const handleDisLike = async (e) => {
    e.preventDefault();
    setIsliked(false);
    disLike(property);
  };

  //check the like button state
  useEffect(() => {
    function loadingPage() {
      if (user && user?.favorites?.includes(property._id)) {
        setIsliked(true);
      } else {
        setIsliked(false);
      }
    }
    loadingPage();
  }, []);

  return (
    <div>
      <div
        className="inner-page-cover overlay"
        style={{
          backgroundImage: `url(${property.images[0].src})`,
          backgroundSize: "cover",            // fill the container fully
          backgroundPosition: "center",       // always centered
          backgroundRepeat: "no-repeat",                 // adjust height as needed (ex: 40-60vh)
          width: "100%",
          position: "relative",
          color: "#fff",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div
          className="container"
          style={{ backgroundColor: `rgb(0, 0, 0, 0.5)`, height: "150%" }}
        >
          <div className="position-absolute media mt-5" onClick={() => property.owner.role === "user" ? setLocation(`/userProfile/${property.owner._id}`) : null} style={{ zIndex: 10 }}>
            <img
              alt=""
              src={property.owner.role === "admin" ? "images/Gilbert AI dark square.png" : property.owner.avatar || userProfile}
              style={{ objectFit: "cover", width: "40px", height: "40px", border: "2px solid #fff", outline: "2px solid #00000080", borderRadius: "50%" }}
              className="img-fluid mr-1 align-self-start"
            />
            <div className="media-body">
              <div className="d-flex flex-row justify-content-between">
                <h6 className="text-light mb-0">
                  <small>
                    {property.owner.role === "admin" ? "Gilbert AI" : property.owner.username}
                  </small>
                </h6>
                <i className="fas fa-angle-down mr-3 text-muted"> </i>
              </div>
              <h6 className="text-light-custom">
                <small>{property && formattedDate}</small>
              </h6>
            </div>
          </div>

          <div className="row align-items-center justify-content-center text-center">
            <div className="col-md-10 mt-5 pt-1">
              <span className="d-inline-block text-white px-3 mb-3 property-offer-type rounded h6 mt-5">
                <small> Détails de la propriété </small>
                <num className="h6 text-danger">
                  n°:{property.propertyNumber}
                </num>
              </span>
              <h6 className="text-light-custom mb-2">
                {" "}
                <ImLocation className="text-danger mr-2" />
                {property.city.fokontany} {property.city.commune}
              </h6>
              <p className="mb-3 h5">
                {property.type === "rent" ? (
                  <strong className="h4 text-success font-weight-bold">
                    {property.rent.toLocaleString("en-US")}{" "}
                    <small>AR/mois</small>
                  </strong>
                ) : (
                  <strong className="h4 text-success font-weight-bold">
                    {property.price.toLocaleString("en-US")} <small>AR</small>
                  </strong>
                )}
              </p>
              <div className="col-md-12">
                <p>
                  <button
                    style={{
                      borderRadius: "20px",
                      backgroundColor: "#222",
                      border: "none",
                      color: "white",
                      padding: "10px 20px",
                      textAlign: "center",
                      fontWeight: "500",
                      fontSize: "16px",
                      cursor: "pointer",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      maxWidth: "200px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}

                    onClick={() => handleShowContact()}
                  >
                    <FaPhoneAlt className="mr-2" />{" "}
                    {user && user
                      ? property.owner._id === user._id
                        ? property.phone1
                        : !user || !timer || user.leftTime
                          ? "Voir contact"
                          : property.phone1
                      : "Voir contact"}
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="position-relative d-flex items-align-end justify-content-end text-danger">
            <div style={{ marginBottom: "20px", bottom: "-100%" }} className="position-absolute ">
              {isliked && isliked ? (
                <div
                  className="d-flex justify-content-center align-items-center property-favoriten"
                  style={{ background: "#f23a2e", zIndex: "1", height: "50px", width: "50px", borderRadius: "50%" }}
                  onClick={handleDisLike}
                >
                  <BsHeartFill className="text-white" />
                </div>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center property-favoriten"
                  style={{ background: "white", color: "black", zIndex: "2", height: "50px", width: "50px", borderRadius: "50%" }}
                  onClick={handleLike}
                >
                  <FaHeart />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselDetails;
