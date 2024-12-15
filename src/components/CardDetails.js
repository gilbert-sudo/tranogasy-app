const CardDetails = ({ property }) => {
  return (
    <div
      style={{ borderTop: "1px solid #7cbd1e", fontWeight: "400" }}
      className="col-12 pt-2 mb-4"
    >
      <ul className="d-flex justify-content-between property-specs-wrap mb-lg-0">
        <li>
          <span className="property-specs">Chambre(s)</span>
          <span className="property-specs-number">
            {property && property.rooms} <sup>+</sup>
          </span>
        </li>
        <li>
          <span className="property-specs">Lv</span>
          <span className="property-specs-number">{property && property.livingRoom}</span>
        </li>
        <li>
          <span className="property-specs">Cuisine(s)</span>
          <span className="property-specs-number">{property && property.kitchen}</span>
        </li>
        <li>
          <span className="property-specs">W.C</span>
          <span className="property-specs-number">{property && property.toilet}</span>
        </li>
        <li>
          <span className="property-specs">Douche</span>
          <span className="property-specs-number">{property && property.bathrooms}</span>
        </li>
        <li style={{ minWidth: "max-content" }}>
          <span className="property-specs">Surface</span>
          <span className="property-specs-number">
            {property && property.area}{" "}
            <small>
              m<sup>2</sup>
            </small>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default CardDetails;
