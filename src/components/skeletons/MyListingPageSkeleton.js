import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MyListingPageSkeleton = () => {
  return (
    <div className="mylisting mt-5 pt-1">
      <div className="site-section site-section-sm">
        <div className="custom-container" style={{ paddingBottom: "80px" }}>
          {/* Page title */}
          <h5 className="mt-3 mb-3 heading-line font-weight-light">
            <Skeleton width={120} height={20} />
          </h5>

          {/* User info */}
          <div className="mb-3 d-flex align-items-center justify-content-start">
            <div className="m-3">
              <h6 className="font-weight-light mt-3">
                <Skeleton width={180} height={16} />
              </h6>
              <strong className="font-weight-bold">
                <Skeleton width={100} height={18} />
              </strong>
            </div>
          </div>

          {/* Cards (Maison / Terrain) */}
          <div className="row">
            <div className="d-flex justify-content-center w-100">
              <div className="d-flex align-items-center justify-content-start ad-category-card m-2 bg-white">
                <div className="ad-category-card-body mb-3">
                  <h1>
                    <Skeleton width={50} height={40} borderRadius={15} />
                  </h1>
                  <div>
                    <h6 className="font-weight-bold mt-3">
                      <Skeleton width={100} />
                    </h6>
                    <strong className="font-weight-light">
                      <Skeleton width={80} />
                    </strong>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-start ad-category-card m-2 bg-white">
                <div className="ad-category-card-body mb-3">
                  <h1>
                    <Skeleton width={50} height={40} borderRadius={15}/>
                  </h1>
                  <div>
                    <h6 className="font-weight-bold mt-3">
                      <Skeleton width={100} />
                    </h6>
                    <strong className="font-weight-light">
                      <Skeleton width={80} />
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create ad button */}
          <div className="d-flex justify-content-center w-100">
            <Skeleton
              width={205}
              height={50}
              borderRadius={20}
              className="m-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyListingPageSkeleton;
