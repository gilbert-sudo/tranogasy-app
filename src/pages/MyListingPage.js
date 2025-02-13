import MyListingDetailsSkeleton from "../components/MyListingDetailsSkeleton";
import { Link, useLocation } from "wouter";
// import ListingCardDetails from "../components/ListingCardDetails";
import { useSelector, useDispatch } from "react-redux";
import { setPreviousUrl, resetImg, resetImgPreview } from "../redux/redux";
import { useEffect, useState } from "react";
import NotLogedIn from "../components/NotLogedIn";
import { FcHome, FcLandscape } from "react-icons/fc";
import { MdAdd } from "react-icons/md";
import { useLoader } from "../hooks/useLoader";
import { usePopup } from "../hooks/usePopup";
import { useImage } from "../hooks/useImage";
import "./css/mylisting.css";

const MyListingPage = () => {
  // redux
  const usersProperties = useSelector((state) => state.usersProperties);
  const pagination = useSelector((state) => state.pagination);
  const user = useSelector((state) => state.user);
  const { loadUsersProperties } = useLoader();
  const { featureUnderConstructionPopup, listingOptionPopup } = usePopup();
  const { noListingImg } = useImage();
  const dispatch = useDispatch();
  const [oneTimeTask, setOneTimeTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  if (oneTimeTask === null) {
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
      {user && user ? (
        <div className="mylisting mt-5 pt-1">
          <div className="site-section site-section-sm bg-light">
            <div className="custom-container" style={{ paddingBottom: "80px" }}>
              <h5 className="mt-3 mb-3 heading-line font-weight-light">
                Annonces
              </h5>
              {usersProperties && usersProperties.length === 0 ? (
                <>
                  <div className="mt-5 no-booking d-flex justify-content-center align-items-center">
                    <img
                      src={noListingImg()}
                      style={{ maxHeight: "45vh", borderRadius: "30px" }}
                      alt="Creer vos annonces"
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
                <>
                  <div className="mb-3 d-flex align-items-center justify-content-start">
                    <div className="m-3">
                      <h6 className="font-weight-light  mt-3">
                        {user && user.username.split(" ")[0]}, vous avez
                      </h6>
                      <strong className="font-weight-bold">
                        {usersProperties && usersProperties.length} annonce
                        {usersProperties && usersProperties.length > 1 && "s"}
                      </strong>
                    </div>
                  </div>
                  <div className="row">
                    {/* <div className="d-flex justify-content-center w-100">
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => setLocation("/myhouselisting")}
                        className="d-flex align-items-center justify-content-start ad-category-card m-2 bg-white"
                      >
                        <div className="d-flex align-items-center flex-column ad-category-card-body my-3">
                          <h1>
                            <FcHome />
                          </h1>
                          <div className="">
                            <h6 className="font-weight-bold text-dark mt-1">Maison</h6>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => setLocation("/myhouselisting")}
                        className="d-flex align-items-center justify-content-start ad-category-card m-2 bg-white"
                      >
                        <div className="d-flex align-items-center flex-column ad-category-card-body my-3">
                          <h1>
                          <FcLandscape />
                          </h1>
                          <div className="">
                            <h6 className="font-weight-bold text-dark mt-1">Terrain</h6>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className="d-flex justify-content-center w-100">
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => setLocation("/myhouselisting")}
                        className="d-flex align-items-center justify-content-start ad-category-card m-2 bg-white"
                      >
                        <div className="ad-category-card-body mb-3">
                          <h1>
                            <FcHome />
                          </h1>
                          <div className="">
                            <h6 className="font-weight-bold  mt-3">Maison</h6>
                            <strong className="font-weight-light">
                              {usersProperties && usersProperties.length}{" "}
                              <small>
                                annonce
                                {usersProperties &&
                                  usersProperties.length > 1 &&
                                  "s"}
                              </small>
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => featureUnderConstructionPopup()}
                        className="d-flex align-items-center justify-content-start ad-category-card m-2 bg-white"
                      >
                        <div className="ad-category-card-body mb-3">
                          <h1>
                            <FcLandscape />
                          </h1>
                          <div className="">
                            <h6 className="font-weight-bold  mt-3">Terrain</h6>
                            <strong className="font-weight-light">
                              0 <small>annonce</small>
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="d-flex justify-content-center w-100">
                <button
                  className="btn btn-success add-ad-btn m-4"
                  onClick={() => listingOptionPopup()}
                  type="button"
                >
                  <MdAdd /> Créer une annonce
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NotLogedIn />
      )}
    </div>
  );
};

export default MyListingPage;
