import { useState} from "react";
import {  Link } from "wouter";
import PropertyDetails from "../components/PropertyDetails";
import PropertyFilter from "../components/PropertyFilter";
import ListingDetailsSkeleton from "../components/skeletons/ListingDetailsSkeleton";
import Skeleton from "react-loading-skeleton";
import HomeSlider from "../components/HomeSlider";

import usePreventGoBack from "../hooks/usePreventGoBack";

import PropertyDetailsPage from "./PropertyDetailsPage";

import { useSelector } from "react-redux";
import { IoMdCloseCircle } from "react-icons/io";
import { BsFillSearchHeartFill } from "react-icons/bs";

const ExplorePage = () => {
  const properties = useSelector((state) => state.properties);
  const topProperties = useSelector((state) => state.topProperties);

  const [isSliderVisible, setIsSlideVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);


  const handleCloseSlideClick = () => {
    setIsSlideVisible(false);
  };

  const handlePropertyClick = (property) => {
    // Navigate to property details or show in modal
    console.log("Property clicked:", property);
    setSelectedProperty(property);
    setIsSlideVisible(true);
  };

   usePreventGoBack((isSliderVisible), () => {
    if (isSliderVisible) {
      handleCloseSlideClick();
    }
    console.log("this is running against my will");
  });

  return (
    <>
      <div id="explorepage" className="home">
        <div className="site-section site-section-sm pb-0">
          <HomeSlider />
          <div className="container" id="prodisplay">
            <PropertyFilter />
          </div>
        </div>
        <div className="site-section site-section-sm bg-light">
          <div className="custom-container" style={{ paddingBottom: "80px" }}>

            {topProperties && topProperties.length > 0 ?
              (
                <div className="row">
                  {topProperties &&
                    topProperties.map(
                      (property) =>
                        property && (
                          <div className="col-md-6 col-lg-4 mb-4">
                            <PropertyDetails
                              key={property._id}
                              property={property}
                              route={"ExplorePage"}
                              handlePropertyClick={handlePropertyClick}
                            />
                          </div>
                        )
                    )}
                </div>
              ) : (
                <div className="row mt-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ListingDetailsSkeleton key={index} />
                  ))}
                </div>
              )}
            <div className="row d-flex justify-content-center w-100">
              {properties &&
                <Link
                  to="/tranogasyMap"
                  className="btn btn-success btn-sm"
                  style={{
                    display: "inline-block",
                    cursor: "pointer",
                    marginLeft: "15px",
                    padding: "5px 10px",
                    borderRadius: "9999px",
                    width: "215px",
                    height: "36px",
                    fontSize: "16px",
                  }}
                >
                  Voir plus d’annonces
                </Link>
              }
              {!properties &&
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Skeleton
                    width={215}
                    height={36}
                    borderRadius={20}
                    baseColor="rgba(124, 189, 30, 0.5)"
                    highlightColor="rgba(124, 189, 30, 0.6)"
                  />
                  <span
                    style={{
                      marginTop: "2px",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "16px",
                      fontWeight: "670",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <BsFillSearchHeartFill /> Préparation
                  </span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      {/* White slider */}
      <div
        className={`property-details-slide ${isSliderVisible ? "show" : ""}`}
        style={{
          position: "fixed",
          left: "50%",
          bottom: 0,
          transform: isSliderVisible
            ? "translate(-50%, 0)"
            : "translate(-50%, 100%)",
          width: "100%",
          height: "99dvh",
          overflowY: "auto",
          backgroundColor: "#fff",
          borderRadius: "30px 30px 0 0",
          boxShadow: "0 -1px 12px hsla(var(--hue), var(--sat), 15%, 0.30)",
          transition: "transform 0.5s ease",
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        {/* mini navbar for the lose button to hide the sliding div */}
        <div
          className="fixed-top"
          style={{
            width: "100%",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "sticky",
          }}
        >
          <IoMdCloseCircle
            style={{
              fontSize: "2rem",
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: "9999",
              backgroundColor: "#fff",
              borderRadius: "50%",
              cursor: "pointer",
              opacity: 1,
              pointerEvents: "auto",
              transition: "opacity 0.3s ease",
            }}
            onClick={() => {
              handleCloseSlideClick();
            }}
          />
        </div>

        {/* Close button to hide the sliding div */}
        {selectedProperty && isSliderVisible && (
          <PropertyDetailsPage
            key={selectedProperty._id}
            fastPreviewProperty={selectedProperty}
            handleCloseSlideClick={handleCloseSlideClick}
          />
        )}

      </div>
    </>
  );
};

export default ExplorePage;