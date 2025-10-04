import { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { GiRobotHelmet } from "react-icons/gi";
import { useLocation } from "wouter";
import { usePopup } from "../hooks/usePopup";

const options = {
  items: 1,
  nav: true,
  dots: false,
  autoplay: true,
  loop: true,
};

const HomeSlider = () => {
  const [, setLocation] = useLocation();
  const [loaded, setLoaded] = useState(false);
  const { featureUnderConstructionPopup } = usePopup();
  const properties = useSelector((state) => state.properties);


  useEffect(() => {
    function loadingComponent() {
      if (properties) {
        setLoaded(true);
      } else {
        setLoaded(false);
      }
    }
    loadingComponent();
  }, [properties]);

  return (
    <OwlCarousel className="slide-one-item home-slider site-blocks-cover-background owl-theme h-50" {...options}>
      <div
        className="site-blocks-cover d-flex align-items-center justify-content-center overlay"
        style={{
          width: "100%",
          backgroundImage:
            "url(https://storage.googleapis.com/tranogasy-cdn/images/Remise%20de%20cl%C3%A9s%20%C3%A9l%C3%A9gante-Photoroom.png)",
        }}
        data-aos="fade"
        data-stellar-background-ratio="0.5"
      >
        <div className="container">
          <div className="row align-items-center justify-content-center text-center">
            <div className="col-md-6 align-self-end">
              <p className="align-self-end">
                {(loaded || properties) ?
                  (
                  <button
                    type="button"
                    onClick={() => setLocation("/tranogasyMap")}
                    className="btn btn-white btn-outline-white btn-5 font-weight-bold"
                    style={{ borderRadius: "30px" }}
                  >
                    <BsFillSearchHeartFill /> Rechercher un bien
                  </button>
                  ) : (
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
                  )
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="site-blocks-cover overlay"
        style={{
          width: "100%",
          backgroundImage: "url(https://storage.googleapis.com/tranogasy-cdn/images/Gillbert%20Ai%20.png)",
        }}
        data-aos="fade"
        data-stellar-background-ratio="0.5"
      >
        <div className="container">
          <div className="row align-items-center justify-content-center text-center">
            <div className="col-md-6 align-self-end">
              <p className="align-self-end">
                <button
                  type="button"
                  onClick={() => featureUnderConstructionPopup()}
                  className="btn btn-5 font-weight-bold"
                  style={{
                    borderRadius: "30px",
                    border: "2px solid #e4ac3c",
                    background: "#1b1b1b",
                    color: "#e4ac3c",
                  }}
                >
                  <GiRobotHelmet /> Recherche intelligente
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </OwlCarousel>
  );
};

export default HomeSlider;
