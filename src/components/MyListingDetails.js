import { Link, useLocation } from "wouter";
import { FaRegEdit } from "react-icons/fa";
import { BsCheck2All, BsTrash3Fill } from "react-icons/bs";
import { MdDoNotDisturb } from "react-icons/md";
import { useProperty } from "../hooks/useProperty";
import MiniCarousel from "../components/MiniCarousel";
import "./css/mylisting.css";

function MyListingDetails({ property }) {
  const { deleteProperty } = useProperty();
  const [location] = useLocation();

  const propertyDataString = JSON.stringify(property);

  return (
    // REMOVED: `col-md-6 col-lg-4 mb-4`
    <div className="property-entry h-100 mx-1">
      <Link
        to={`/property-details/${property._id}/${encodeURIComponent(propertyDataString)}/${location.split("/")[1]}`}
        className="property-thumbnail"
      >
        <div className="offer-type-wrap">
          {property.type === "rent" ? (
            <span className="offer-type bg-success">Location</span>
          ) : (
            <span className="offer-type bg-danger">Vente</span>
          )}
        </div>
        <div className="d-flex justify-content-end offer-type-wrap w-100">
          <button
            className="btn btn-danger btn-sm listing-delete-button mr-3"
            onClick={(e) => {
              e.preventDefault();
              deleteProperty(property);
            }}
          >
            <BsTrash3Fill className="listing-delete-btn-icon mt-1" />
            <strong>Supprimer</strong>
          </button>
        </div>
        <MiniCarousel images={property.images} />
      </Link>
      <div className="p-3 property-body">
        <Link
          className="text text-dark"
          to={`/property-details/${property._id}/${encodeURIComponent(propertyDataString)}/${location.split("/")[1]}`}
        >
          <h2 className="property-title">{property.title}</h2>
          <span className="property-location d-block">
            {property.city.fokontany} {property.city.commune}{" "}
            {property.city.district}
          </span>
          <div className="property-title">
            {property.type === "rent" ? (
              <small className="d-flex text-success justify-content-end">
                {property.rent.toLocaleString("en-US")} Ar/mois
              </small>
            ) : (
              <small className="d-flex text-danger justify-content-end">
                {property.price.toLocaleString("en-US")} Ar
              </small>
            )}
          </div>
        </Link>
        <div className="d-flex justify-content-between w-100 pt-2">
          <small className="pt-2">
            Statut:{" "}
            {property.status === "available" && (
              <status className="text-success">
                Disponible <BsCheck2All />
              </status>
            )}
            {property.status === "pending" && (
              <status className="text-success">
                En attente...
              </status>
            )}
            {property.status === "occupated" && (
              <status className="text-warning">
                Occupé 
              </status>
            )}
            {property.status === "unavailable" && (
              <status className="text-danger">
                Indisponible <MdDoNotDisturb />
              </status>
            )}
          </small>
          <Link
            to={`/update-property/${encodeURIComponent(propertyDataString)}`}
            style={{ borderRadius: "15px" }}
            className="btn btn-sm btn-secondary"
          >
            <FaRegEdit /> Editer
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MyListingDetails;