import { useState } from "react";
import { Link } from "wouter";
import Skeleton from "react-loading-skeleton";
import PropertyDetails from "../components/PropertyDetails";
import PropertyFilter from "../components/PropertyFilter";
import HomeSlider from "../components/HomeSlider";
import { useSelector } from "react-redux";
import { BsFillSearchHeartFill } from "react-icons/bs";

const ExplorePage = () => {
  //redux
  const topProperties = useSelector((state) => state.topProperties);
  const properties = useSelector((state) => state.properties);


  const [oneTimeTask, setOneTimeTask] = useState(null);

  if (oneTimeTask === null) {
    // Check if the property preview exists in local storage
    const propertyPreview = localStorage.getItem("propertyPreview");
    if (propertyPreview) {
      console.log("Property preview exists in local storage.", propertyPreview);
    }
    setOneTimeTask("done");
  }


  return (
    <div id="explorepage" className="home">
      <div className="site-section site-section-sm pb-0">
        <HomeSlider />
        <div className="container" id="prodisplay">
          <PropertyFilter />
        </div>
      </div>
      <div className="site-section site-section-sm bg-light">
        <div className="custom-container" style={{ paddingBottom: "80px" }}>
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
                      />
                    </div>
                  )
              )}
          </div>
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
  );
};

export default ExplorePage;
