import { useSelector } from "react-redux";
import { FaPhoneAlt } from "react-icons/fa";
import { ImLocation } from "react-icons/im";
import "./css/sweetalert.css";
//import user photo profil
import userProfile from "../img/user-avatar.png";

const CarouselDetails = ({ property, handleShowContact }) => {
  const user = useSelector((state) => state.user);
  const timer = useSelector((state) => state.timer.timer);

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short", // Use short month name
    day: "2-digit", // Use 2-digit day format
    timeZone: "Indian/Antananarivo",
  }).format(new Date(property.created_at));

  return (
    <div>
      <div
        className="site-blocks-cover inner-page-cover overlay"
        style={{ backgroundImage: `url(${property.images[0].src})` }}
        data-aos="fade"
        data-stellar-background-ratio="0.5"
      >
        <div
          className="container"
          style={{ backgroundColor: `rgb(0, 0, 0, 0.5)` }}
        >
          <div className="position-absolute media mt-5">
            <img
              alt=""
              src={property.owner?.avatar ? property.owner.avatar : userProfile}
              style={{ objectFit: "cover", width: "40px", height: "40px", border: "2px solid #fff", outline: "2px solid #00000080", borderRadius: "50%" }}
              className="img-fluid mr-1 align-self-start"
            />
            <div className="media-body">
              <div className="d-flex flex-row justify-content-between">
                <h6 className="text-light mb-0">
                  <small>
                    {property.owner.username}
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
            <div className="col-md-10 mt-5">
              <span className="d-inline-block text-white px-3 mb-3 property-offer-type rounded h6">
                Détails de la propriété{" "}
                <num className="h6 text-danger">
                  n°:{property.propertyNumber}
                </num>
              </span>
              <h6 className="text-light-custom mb-2 h6">
                {" "}
                <ImLocation className="text-danger mr-2" />
                {property.city.fokontany} {property.city.commune}
              </h6>
              <p className="mb-3 h4">
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
                    style={{ borderRadius: "15px" }}
                    onClick={() => handleShowContact()}
                    className="btn btn-white btn-outline-white py-1 px-2 btn-2"
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
        </div>
      </div>
    </div>
  );
};

export default CarouselDetails;
