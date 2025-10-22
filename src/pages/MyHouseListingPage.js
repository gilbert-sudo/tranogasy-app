import PropertyDetails from "../components/PropertyDetails";
import MyListingDetailsSkeleton from "../components/skeletons/MyListingDetailsSkeleton";
import { Link, useLocation } from "wouter";
import { useSelector, useDispatch } from "react-redux";
import {
  setPreviousUrl,
  resetImg,
  resetImgPreview,
} from "../redux/redux";
import { useEffect, useState, useRef, useCallback } from "react";
import NotLogedIn from "../components/NotLogedIn";
import { MdArrowBackIos } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { BsSearch, BsFillHouseAddFill } from "react-icons/bs";
import { useLoader } from "../hooks/useLoader";
import { useImage } from "../hooks/useImage";
import { FixedSizeGrid as Grid } from "react-window";

const MyHouseListingPage = () => {
  const usersProperties = useSelector((state) => state.usersProperties);
  const pagination = useSelector((state) => state.pagination);
  const user = useSelector((state) => state.user);
  const { loadUsersProperties } = useLoader();
  const { noInputValueForSearchImg, noSearchResultImg } = useImage();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const [lastViewedIndex, setLastViewedIndex] = useState(0);

  const gridContainerRef = useRef();
  const gridRef = useRef();
  const [gridWidth, setGridWidth] = useState(0);
  const [columnCount, setColumnCount] = useState(3);

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [isWithinAllowedHours, setIsWithinAllowedHours] = useState(false);
  const [todayCount, setTodayCount] = useState(0);

  //handle property search
  function searchUsersProperty(propertyNumber) {
    console.log("proertyNumber", Number(propertyNumber), usersProperties);
    const property = usersProperties.filter((prop) => prop.propertyNumber === Number(propertyNumber));
    setSearchResult(property);
    console.log("Form submited, search results", property);
  }

  const handleCreateListing = () => {
    const bypassedUser = (user._id === "656083da05f993ac9d2cc063");

    if (user.banned) {
      alert("📵 L'administrateur a temporairement retiré cette fonctionnalité de votre compte.");
      return;
    }
    if (!isWithinAllowedHours) {
      alert("⏰ Les annonces peuvent être créées entre 6h et 18h uniquement.");
      return;
    }
    if (bypassedUser && todayCount >= 30) {
      alert("🚫 Vous avez atteint la limite de 30 annonces pour aujourd’hui.");
      return;
    }
    if (!bypassedUser && todayCount >= 22) {
      alert("🚫 Vous avez atteint la limite de 20 annonces pour aujourd’hui.");
      return;
    }
    setLocation("/create-listing");
  };


  // Initialize component and reset state if needed
  useEffect(() => {
    window.scrollTo(0, 0);
    if (pagination[0]?.previousUrl === "/update-property") {
      dispatch(setPreviousUrl(null));
      dispatch(resetImg());
      dispatch(resetImgPreview());
    }
  }, [dispatch, pagination]);

  //search input toggle effect
  const inputRef = useRef(null);

  useEffect(() => {
    if (showSearchInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearchInput]);

  useEffect(() => {
    // ✅ Check if within allowed hours
    const now = new Date();
    const hours = now.getHours();
    user && (user?.role === "admin") ? setIsWithinAllowedHours(hours >= 6 && hours < 18) : setIsWithinAllowedHours(true);

    // ✅ Count today's properties
    if (usersProperties?.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const count = usersProperties.filter((property) => {
        const createdAt = new Date(property.created_at);
        return createdAt >= today;
      }).length;

      setTodayCount(count);
    }
  }, [usersProperties]);

  // Load user properties
  useEffect(() => {
    const loadData = async () => {
      if (!usersProperties && user) {
        setLoading(true);
        await loadUsersProperties(user._id);
        setTimeout(() => {
          setLoading(false);
        }, 1000);

      }
    };
    loadData();
  }, [usersProperties, user, loadUsersProperties]);

  // Handle responsive grid layout
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
  }, [usersProperties]);

  // Restore scroll position
  useEffect(() => {
    const savedIndex = sessionStorage.getItem('lastViewedIndex');
    if (savedIndex) {
      setLastViewedIndex(parseInt(savedIndex, 10));
      sessionStorage.removeItem('lastViewedIndex');
    }
  }, []);

  useEffect(() => {
    if (lastViewedIndex > 0 && gridRef.current && usersProperties?.length > 0) {
      const rowIndex = Math.floor(lastViewedIndex / columnCount);
      requestAnimationFrame(() => {
        gridRef.current?.scrollToItem({
          rowIndex,
          align: 'start',
          behavior: 'smooth'
        });
      });
    }
  }, [lastViewedIndex, columnCount, usersProperties]);

  const ItemSize = 400;

  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const property = usersProperties?.[index];

    if (!property || !usersProperties || !usersProperties.length > 0) return null;

    return (
      <div
        style={style}
        onClick={() => {
          setLastViewedIndex(index);
          sessionStorage.setItem('lastViewedIndex', index.toString());
        }}
      >
        <div style={{ padding: '8px', height: '100%' }}>
          <PropertyDetails
            key={property._id}
            property={property}
            route={"MyHouseListingPage"}
          />
        </div>
      </div>
    );
  }, [columnCount, usersProperties]);

  return (
    <div className="mylisting">
      {user ? (
        <>
          <div className="mylisting mt-5 pt-1">
            <div className="site-section site-section-sm bg-light">
              <div className="custom-container" style={showSearchInput ? { paddingTop: "9dvh" } : { paddingBottom: "9dvh" }}>
                {usersProperties?.length === 0 ? (
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
                ) : usersProperties && usersProperties.length > 0 ?
                  (
                    <>
                      <div className="row" ref={gridContainerRef} style={{ display: showSearchInput ? "none" : "block" }}>
                        {gridWidth > 0 && (
                          <Grid
                            ref={gridRef}
                            columnCount={columnCount}
                            columnWidth={Math.floor(gridWidth / columnCount)}
                            height={window.innerHeight - (showSearchInput ? 150 : 80)} // Adjust for header
                            rowCount={Math.ceil(usersProperties.length / columnCount)}
                            rowHeight={(ItemSize / 100) * 102}
                            width={(gridWidth / 100) * 101.5}
                            itemData={usersProperties}
                          >
                            {Cell}
                          </Grid>
                        )}
                      </div>
                      <div style={{ display: showSearchInput ? "block" : "none" }}>
                        <div className="mt-5 no-booking d-flex justify-content-center align-items-center">
                          {!searchResult &&
                            <img
                              src={noInputValueForSearchImg()}
                              style={{ maxHeight: "45vh", borderRadius: "30px" }}
                              alt="Creer vos annonces"
                              className="img-fluid"
                            />
                          }
                          {searchResult && searchResult.length === 0 &&
                            <img
                              src={noSearchResultImg()}
                              style={{ maxHeight: "45vh", borderRadius: "30px" }}
                              alt="Creer vos annonces"
                              className="img-fluid"
                            />
                          }
                        </div>
                        <center>
                          {" "}
                          {!searchResult &&
                            <p style={{ fontWeight: "400" }} className="m-2">
                              Pour la recherche, veuillez indiquer le numéro du bien.
                            </p>
                          }
                          {searchResult && searchResult.length === 0 &&
                            <p style={{ fontWeight: "400" }} className="m-2">
                              Ce numéro ne correspond à aucun bien que vous possédez.
                            </p>
                          }
                        </center>
                        {searchResult && searchResult.length > 0 &&
                          <div style={{ height: '100%', maxWidth: '400px' }}>
                            <PropertyDetails
                              property={searchResult[0]}
                              route={"MyHouseListingPage"}
                            />
                          </div>
                        }
                      </div>
                    </>
                  ) : (
                    <div className="row mt-3">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <MyListingDetailsSkeleton key={index} />
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div
            className="fixed-bottom bg-white d-flex align-items-center justify-content-between px-3 py-2"
            style={{
              width: "96%",
              maxWidth: "450px",
              border: "1px solid rgba(0, 0, 0, 0.3)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
              borderRadius: "30px",
              //center horizontally
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: showSearchInput ? "86dvh" : "1.5dvh",
              padding: "10px 20px",
              zIndex: 1000
            }}
          >
            {/* Go Back Button */}
            {!showSearchInput &&
              <Link
                to="/mylisting"
                onClick={() => window.history.back()}
                className="d-flex align-items-center text-dark text-decoration-none mb-2"
              >
                <MdArrowBackIos />
                <span className="fw-light">Retour</span>
              </Link>
            }
            {showSearchInput &&
              <button
                type="button"
                onClick={() => {
                  setShowSearchInput(false);
                  setSearchInput("");
                  setSearchResult(null);
                }}
                className="d-flex align-items-center text-dark text-decoration-none mb-2 border-0 bg-light"
              >
                <MdArrowBackIos />
              </button>
            }

            {/* Search Form */}
            <form
              className="d-flex align-items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div style={{ position: "relative", flex: 1, display: showSearchInput ? "block" : "none" }}>
                <label
                  style={{
                    position: "absolute",
                    top: "-8px",
                    left: "15px",
                    background: "#fff",
                    padding: "0 6px",
                    fontSize: "10px",
                    color: "#6b7280",
                  }}
                >
                  Numéro du bien
                </label>
                <input
                  className="MyListingSearchInput"
                  ref={inputRef}
                  type="number"
                  max="999999"   // numeric maximum
                  value={searchInput}
                  onChange={(e) => {
                    if (e.target.value.length === 0) {
                      setSearchResult(null);
                    }
                    if (e.target.value.length <= 6) {
                      setSearchInput(e.target.value);
                    }
                  }}
                  placeholder="Un numéro"
                  style={{
                    width: "100%",
                    minWidth: "140px",
                    border: "1px solid #999",
                    borderRadius: "16px",
                    padding: "15px 12px",
                    textAlign: "center",
                    fontSize: "16px",
                    right: "0",
                  }}
                />
              </div>
              <button
                className="btn btn-dark d-flex align-items-center justify-content-center"
                type={showSearchInput ? "submit" : "button"}
                aria-label="Rechercher une annonce"
                onClick={() => {
                  if (searchInput && showSearchInput) {
                    searchUsersProperty(searchInput);
                  }
                  if (!searchInput) {
                    setShowSearchInput(!showSearchInput);
                  }
                }}
                style={{ borderRadius: "20px", marginLeft: "2px", padding: "16px 14px" }}
              >
                <BsSearch />
              </button>
              {!showSearchInput &&
                <button
                  onClick={handleCreateListing}
                  className="btn btn-success d-flex align-items-center justify-content-center"
                  aria-label="Créer une nouvelle annonce"
                  style={{ borderRadius: "50%", marginLeft: "2px", padding: "13px 12px" }}
                >
                  <BsFillHouseAddFill style={{ fontSize: "20px" }} />
                </button>
              }
              {showSearchInput &&
                <button
                  onClick={() => {
                    setShowSearchInput(false);
                    setSearchInput("");
                    setSearchResult(null);
                  }}
                  className="btn btn-danger d-flex align-items-center justify-content-center"
                  aria-label="Créer une nouvelle annonce"
                  style={{ borderRadius: "50%", marginLeft: "2px", padding: "13px 12px" }}
                >
                  <RxCross2 style={{ fontSize: "20px" }} />
                </button>
              }
            </form>
          </div>
        </>
      ) : (
        <NotLogedIn />
      )}
    </div>
  );
};

export default MyHouseListingPage;