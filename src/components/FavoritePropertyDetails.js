import { Link } from "wouter";
import { BsTrashFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useLike } from "../hooks/useLike";
import { useEffect, useState } from "react";

function FavoritePropertyDetails({ property }) {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Indian/Antananarivo",
  }).format(new Date(property.created_at));

  const { disLike } = useLike();
  const [isliked, setIsliked] = useState(false);
  //redux
  const user = useSelector((state) => state.user);

  const likedProperties = useSelector((state) => state.likedProperties);

  //click the disLike button
  const handleDisLike = async (e) => {
    e.preventDefault();
    setIsliked(false);
    // Prevent scrolling to the top
    window.scrollTo({
      top: window.scrollY,
      behavior: "smooth",
    });
    disLike(property);
  };

  //stringify the property data to pass it as parameter
  const propertyDataString = JSON.stringify(property);

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
  }, [likedProperties]);

  return (
    // col-4 col-md-3 col-lg-2 col-xl-2
    <div className="col-4 col-md-3 col-lg-2 col-xl-2 px-0">
      <div className="property-entry h-100 mx-1">
        <Link
          to={`/property-details/${property._id}/${encodeURIComponent(
            propertyDataString
          )}`}
          className="property-thumbnail"
        >
          <div className="offer-type-wrap mr-2">
            {property.type === "rent" ? (
              <span className="offer-type font-weight-bold bg-success">
                {property.rent.toLocaleString("en-US")} Ar/mois
              </span>
            ) : (
              <span className="offer-type font-weight-bold bg-danger">
                {property.price.toLocaleString("en-US")} Ar
              </span>
            )}
          </div>
          <div className="favorite-date-details-wrap text-light">
            {property.created_at && formattedDate}
          </div>
          <div className="favorite-quarter-details-wrap text-light">
            {property.city && property.city.district}
          </div>
          <div
            className="image-container"
            style={{ height: "14rem", overflow: "hidden" }}
          >
            <img
              className="img img-fluid"
              src={property.images[0].src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
        </Link>
        <div className="p-1 property-body">
          {isliked && (
            <div
              className="property-favorite"
              style={{
                border: "3px solid #fff",
                background: "#f23a2e",
                zIndex: "1",
              }}
              onClick={handleDisLike}
            >
              <BsTrashFill className="text-white mb-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritePropertyDetails;