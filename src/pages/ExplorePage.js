import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import Skeleton from "react-loading-skeleton";
import PropertyDetails from "../components/PropertyDetails";
import PropertyFilter from "../components/PropertyFilter";
import ListingDetailsSkeleton from "../components/skeletons/ListingDetailsSkeleton";
import HomeSlider from "../components/HomeSlider";
import { useSelector } from "react-redux";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { FixedSizeGrid as Grid } from "react-window";

const ExplorePage = () => {
  const topProperties = useSelector((state) => state.topProperties);
  const gridContainerRef = useRef();
  const gridRef = useRef();
  const [gridWidth, setGridWidth] = useState(0);
  const [columnCount, setColumnCount] = useState(3);
  const [atTheTop, setAtTheTop] = useState(true);

  // prevent scroll on body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // responsive columns
  useEffect(() => {
    const updateGridMetrics = () => {
      if (gridContainerRef.current) {
        const newWidth = gridContainerRef.current.offsetWidth;
        setGridWidth(newWidth);
        if (newWidth < 480) setColumnCount(1);
        else if (newWidth < 768) setColumnCount(2);
        else setColumnCount(3);
      }
    };
    updateGridMetrics();
    window.addEventListener("resize", updateGridMetrics);
    return () => window.removeEventListener("resize", updateGridMetrics);
  }, [topProperties]);

  const ItemSize = 400;

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }) => {
      const index = rowIndex * columnCount + columnIndex;
      const property = topProperties?.[index];
      if (!property) return null;
      return (
        <div style={style}>
          <div style={{ padding: "8px", height: "100%" }}>
            <PropertyDetails
              key={property._id}
              property={property}
              route={"TranogasyList"}
            />
          </div>
        </div>
      );
    },
    [columnCount, topProperties]
  );


  return (
    <div id="explorepage" className="home">
      <div className="site-section site-section-sm pb-0">

        {/* 🧭 Smooth HomeSlider */}
        <div
          style={{
            transform: atTheTop ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "top",
            opacity: atTheTop ? 1 : 0,
            height: atTheTop ? "auto" : "0px",
            transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
            willChange: "transform, opacity, height",
            overflow: "hidden",
          }}
        >
          <HomeSlider />
        </div>

        <div
          className={`container transition-all duration-500 ${atTheTop ? "mt-1" : "mt-5"
            }`}
          id="prodisplay"
        >
          <PropertyFilter />
        </div>
      </div>

      <div className="site-section site-section-sm bg-light">
        <div className="custom-container">
          {topProperties?.length === 0 ? (
            <div className="empty-state">
              <div className="no-booking d-flex justify-content-center align-items-center">
                <img
                  src="images/create-ad.jpg"
                  alt="Aucune propriété listée"
                  className="img-fluid empty-state-image"
                />
              </div>
              <p className="empty-state-message">
                Créez votre annonce dès maintenant et trouvez le parfait
                acheteur ou locataire pour votre propriété !
              </p>
            </div>
          ) : topProperties && topProperties.length > 0 ? (
            <div className="row" ref={gridContainerRef}>
              {gridWidth > 0 && (
                <Grid
                  ref={gridRef}
                  columnCount={columnCount}
                  columnWidth={Math.floor(gridWidth / columnCount)}
                  height={window.innerHeight - 80}
                  rowCount={Math.ceil(topProperties.length / columnCount)}
                  rowHeight={(ItemSize / 100) * 106}
                  width={(gridWidth / 100) * 101.5}
                  itemData={topProperties}
                  style={{
                    scrollbarWidth: "none",
                    paddingBottom: "100px",
                    willChange: "scroll-position",
                  }}
                  onScroll={({ scrollTop }) => {
                    const itemHeight = (ItemSize / 100) * 106;
                    const hideThreshold = itemHeight * 2; // allow 2 items scroll before hiding

                    setAtTheTop((prev) => {
                      if (scrollTop <= 0 && !prev) return true;
                      if (scrollTop > hideThreshold && prev) return false;
                      return prev;
                    });
                  }}
                >
                  {Cell}
                </Grid>
              )}
            </div>
          ) : (
            <div className="row mt-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ListingDetailsSkeleton key={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
