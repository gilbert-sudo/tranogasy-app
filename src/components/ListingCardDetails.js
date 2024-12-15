import { Link, useLocation } from "wouter";
import { FaHeart, FaRegEdit } from "react-icons/fa";
import { BsHeartFill, BsTrash3Fill } from "react-icons/bs";
import { useLike } from "../hooks/useLike";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function ListingCardDetails({ property }) {
  const { like, disLike } = useLike();
  const [isliked, setIsliked] = useState(false);
  const [location, setLocation] = useLocation();
  const [likeId, setLikeId] = useState(null);

  //redux
  const user = useSelector((state) => state.user);
  var userId = null;
  const likedPropertiesState = useSelector((state) => state.likedProperties);

  const propertyId = property._id;

  if (user) {
    userId = user._id;
  }


  //click the like button
  const handleLike = () => {
    like(userId, propertyId);
    if (!user) {
      Swal.fire({
        title: "<h6><strong>Vous êtes déconnecté(e)<strong><h6/>",
        html: `Pour aimer et sauvegarder des articles, connectez-vous ou créez votre compte gratuitement. Merci !`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Se connecter",
        confirmButtonColor: "#7cbd1e",
        cancelButtonText: "Annuler",
        cancelButtonColor: "#F31559",
        customClass: {
          popup: "smaller-sweet-alert",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setLocation("/login");
          console.log(location);
        }
      });
    }
  };
  //click the disLike button
  const handleDisLike = () => {
    disLike(likeId);
    setIsliked(false);
    console.log("click on dislike");
  };
  //check the like button state

  useEffect(() => {
    const verifyLikeButton = () => {
      if (likedPropertiesState) {
        const likedProperties = likedPropertiesState.filter(
          (liked) => liked.property._id === propertyId
        );
        const otherLikedProperties = likedPropertiesState.filter(
          (liked) => liked.property === propertyId
        );
        if (likedProperties.length !== 0 || otherLikedProperties.length !== 0) {
          setIsliked(true);
          setLikeId(likedProperties[0]._id);
        }
      }
    };
    if (user) {
      verifyLikeButton();
    }
  }, [likedPropertiesState, propertyId, user]);
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="property-entry h-100">
        <Link
          to={`/property-details/${property._id}`}
          className="property-thumbnail"
        >
          <div className="offer-type-wrap">
            <span className="offer-type bg-success">Location</span>
          </div>
          <img
            src={property.images.length ? property.images[0].url : ""}
            alt=""
            className="img-fluid"
            style={{ borderRadius: "20px 0 20px 0" }}
          />
        </Link>
        <div className="p-4 property-body">
          {isliked && isliked ? (
            <div
              className="property-favorite"
              style={{ background: "#f23a2e", zIndex: "1" }}
              onClick={handleDisLike}
            >
              <BsHeartFill className="text-white" />
            </div>
          ) : (
            <div className="property-favorite" onClick={handleLike}>
              <FaHeart />
            </div>
          )}
          <div className="d-flex flex-row w-100 justify-content-center">
            <span className="property-location d-block">
              <h5>Bien nº :</h5>
            </span>
            <span className="property-location d-block">
              <h5 className="text-danger">{property.propertyNumber}</h5>
            </span>
          </div>
          <Link to={`/property-details/${property._id}`}>
            <span className="property-location d-block mb-3">
              <span className="property-icon icon-room" /> 625 S. {property.city.fokontany}{" "}
              St Unit 607 {property.city.commune}, CA 90005 <br />
            </span>
          </Link>
          <small>
            <strong>Votre numero:</strong>
          </small>
          <ul className="d-flex justify-content-between property-specs-wrap mb-lg-0">
            {/* <li>
            Statut:<span className="text-success"> en atente</span>
          </li> */}
            <li className="d-flex align-items-center">
              <num
                className="mt-1 font-weight-bold"
                style={{ fontSize: "14px" }}
              >
                0345189896
              </num>
              <u className="text-success">
                <FaRegEdit className="ml-2" /> changer{" "}
              </u>
            </li>
            <li>
              <span className="property-specs">
                <button
                  style={{ borderRadius: "10px 0 10px 0" }}
                  className="btn btn-danger btn-sm font-weight-light"
                >
                  <BsTrash3Fill className="mb-1" /> Annuler
                </button>
              </span>
            </li>
          </ul>
          <strong className="w-100 property-price text-primary d-flex justify-content-end">
            <small className="font-weight-bold">
              {property.rent} AR / mois
            </small>
          </strong>
        </div>
      </div>
    </div>
  );
}

export default ListingCardDetails;
