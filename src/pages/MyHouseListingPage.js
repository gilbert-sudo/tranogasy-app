import MyListingDetails from "../components/MyListingDetails";
import MyListingDetailsSkeleton from "../components/MyListingDetailsSkeleton";
import { Link, useLocation } from "wouter";
// import ListingCardDetails from "../components/ListingCardDetails";
import { useSelector, useDispatch } from "react-redux";
import {
  setPreviousUrl,
  resetImg,
  resetImgPreview,
} from "../redux/redux";
import { useEffect, useState } from "react";
import NotLogedIn from "../components/NotLogedIn";
import { MdAddCircleOutline, MdArrowBackIos } from "react-icons/md";
import { useLoader } from "../hooks/useLoader";

const MyHouseListingPage = () => {
  // redux
  const usersProperties = useSelector((state) => state.usersProperties);
  const pagination = useSelector((state) => state.pagination);
  const user = useSelector((state) => state.user);
  const { loadUsersProperties } = useLoader();
  const dispatch = useDispatch();
  const [oneTimeTask, setOneTimeTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  if (oneTimeTask === null) {
    window.scrollTo(0, 0);
    if (pagination[0].previousUrl === "/update-property") {
      dispatch(setPreviousUrl(null));
      dispatch(resetImg());
      dispatch(resetImgPreview());
    }
    setOneTimeTask("done");
  }

  useEffect(() => {
    const pageLoader = async () => {
      if (!usersProperties && user) {
        setLoading(true);
        await loadUsersProperties(user._id);
        setLoading(false);
      }
    };
    pageLoader();
  }, [usersProperties]);

  return (
    <div className="mylisting">
      {user && user ? (<>
        <div className="mylisting mt-5 pt-1">
          <div className="site-section site-section-sm bg-light">
            <div className="custom-container" style={{ paddingBottom: "80px" }}>
              <div className="fixed-top mt-5" style={{ minWidth: "max-content"}}>
                <Link to="/mylisting">
                  <h6
                    style={{ cursor: "pointer", minWidth: "max-content" }}
                    className="font-weight-light m-2 go-back-link p-2"
                  >
                    <MdArrowBackIos
                      style={{ fontSize: "15px", marginBottom: "3px" }}
                    />{" "}
                    Retour
                  </h6>
                </Link>
              </div>
              {usersProperties && usersProperties.length === 0 ? (
                <>
                  <div className="mt-5 no-booking d-flex justify-content-center align-items-center">
                    <img
                      src="images/create-ad.jpg"
                      style={{ maxHeight: "45vh" }}
                      alt="Pas de connexion Internet"
                      className="img-fluid"
                    />
                  </div>
                  <center>
                    {" "}
                    <p style={{ fontWeight: "400" }} className="m-2">
                      Créez votre annonce dès maintenant et trouvez le parfait
                      acheteur ou locataire pour votre propriété !
                    </p>
                  </center>
                </>
              ) : (
                <div className="row mt-3">
                  {usersProperties &&
                    usersProperties.map(
                      (property) =>
                        property && (
                          <MyListingDetails
                            key={property._id}
                            property={property}
                          />
                        )
                    )}
                </div>
              )}
              {!usersProperties && (
                <div className="row mt-3">
                  {[...Array(6)].map((_, index) => (
                    <MyListingDetailsSkeleton key={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="fixed-bottom d-flex justify-content-end w-100"><button onClick={() => setLocation("/create-listing")} className="btn btn-success quick-add-ad-btn mb-4 mr-3" type="button">+</button></div>
        </>
      ) : (
        <NotLogedIn />
      )}
    </div>
  );
};

export default MyHouseListingPage;
