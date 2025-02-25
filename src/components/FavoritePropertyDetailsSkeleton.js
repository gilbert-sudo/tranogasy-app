import Skeleton from "react-loading-skeleton";

function FavoritePropertyDetails() {
 
  return (
    // col-4 col-md-3 col-lg-2 col-xl-2
    <div className="col-4 col-md-3 col-lg-2 col-xl-2 px-0">
      <div className="property-entry h-100 mx-1">
          <div
            className="image-container"
            style={{ height: "14rem", overflow: "hidden" }}
          >
            <Skeleton
              className="img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
      </div>
    </div>
  );
}

export default FavoritePropertyDetails;
