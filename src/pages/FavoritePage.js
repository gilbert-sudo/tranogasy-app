import FavoritePropertyDetails from "../components/FavoritePropertyDetails";
import { useSelector } from "react-redux";
import { useLoader } from "../hooks/useLoader";
import { useEffect, useState } from "react";
import NotLogedIn from "../components/NotLogedIn";

const FavoritePage = () => {
  // redux
  const { loadLikes } = useLoader();
  const likedPropertiesState = useSelector((state) => state.likedProperties);
  const user = useSelector((state) => state.user);

  const [oneTimeTask, setOneTimeTask] = useState(null);

  if (oneTimeTask === null) {
    // scroll to top of the page
    window.scrollTo(0, 0);
    setOneTimeTask("done");
  }

  useEffect(() => {
    const pageLoader = () => {
      if (user) {
        if (!likedPropertiesState) {
          const userId = user._id;
          loadLikes(userId);
        }
      }
      if (likedPropertiesState) {
        console.log(likedPropertiesState);
      }
    };
    pageLoader();
  }, [user, likedPropertiesState]);

  return (
    <div className="myfavorite">
      {user && user ? (
        <div className="myfavorite pt-3">
          <div className="site-section site-section-sm bg-light pt-3">
            <div className="custom-container" style={{ paddingBottom: "80px" }}>
              <h5 className="mt-3 mb-3 heading-line font-weight-light">Favoris</h5>
              {likedPropertiesState && likedPropertiesState.length === 0 ? (
                <>
                  <div className="no-booking d-flex justify-content-center align-items-center">
                    <img
                      className="img-fluid"
                      style={{ maxHeight: "55vh", borderRadius: "15px" }}
                      src="images/love the house.png"
                      alt="Pas de favoris"
                    />
                  </div>
                  <center>
                    {" "}
                    <p style={{ fontWeight: "400" }} className="m-2">
                      Répertorier les propriétés qui vous intéressent en
                      cliquant sur l'icône en forme de cœur.
                    </p>
                  </center>
                </>
              ) : (
                <div className="row">
                  {likedPropertiesState &&
                    likedPropertiesState.map(
                      (likedProperty) =>
                        likedProperty && (
                          <FavoritePropertyDetails
                            key={likedProperty._id}
                            property={likedProperty}
                          />
                        )
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <NotLogedIn />
      )}
    </div>
  );
};

export default FavoritePage;