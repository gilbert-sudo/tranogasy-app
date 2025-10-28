import Skeleton from "react-loading-skeleton";
import "../css/mylisting.css";

function ListingDetailsSkeleton() {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="property-entry h-100 mx-1">
        <div className="slide-one-item home-slider owl-theme">
          <div style={{ height: "18rem", overflow: "hidden" }}>
            <Skeleton
              className="img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "15px",
              }}
            />
          </div>
        </div>
        <div className="p-3 property-body">
          <h2 className="property-title">
            <Skeleton />
          </h2>
          <span className="property-location d-block">
            <Skeleton />
          </span>
          <div className="property-title">
            <small className="d-flex justify-content-end">
              <Skeleton style={{ width: "15vh" }} />
            </small>
          </div>
          <div className="d-flex justify-content-between w-100 pt-2">
            <small className="pt-2">
              <Skeleton style={{ width: "13vh" }} />
            </small>
            <Skeleton style={{ borderRadius: 15 }} height={31} width={72} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetailsSkeleton;
