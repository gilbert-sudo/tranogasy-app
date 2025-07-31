import MyListingDetails from "../components/MyListingDetails";
import MyListingDetailsSkeleton from "../components/MyListingDetailsSkeleton";
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
import { useLoader } from "../hooks/useLoader";
import { FixedSizeGrid as Grid } from "react-window";

const MyHouseListingPage = () => {
  const usersProperties = useSelector((state) => state.usersProperties);
  const pagination = useSelector((state) => state.pagination);
  const user = useSelector((state) => state.user);
  const { loadUsersProperties } = useLoader();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const [lastViewedIndex, setLastViewedIndex] = useState(0);

  const gridContainerRef = useRef();
  const gridRef = useRef();
  const [gridWidth, setGridWidth] = useState(0);
  const [columnCount, setColumnCount] = useState(3);

  // Initialize component and reset state if needed
  useEffect(() => {
    window.scrollTo(0, 0);
    if (pagination[0]?.previousUrl === "/update-property") {
      dispatch(setPreviousUrl(null));
      dispatch(resetImg());
      dispatch(resetImgPreview());
    }
  }, [dispatch, pagination]);

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

        if (newWidth < 768) setColumnCount(1);
        else if (newWidth < 992) setColumnCount(2);
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
          <MyListingDetails property={property} />
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
              <div className="custom-container" style={{ paddingBottom: "80px" }}>
                <div className="fixed-top mt-5" style={{ width: "max-content" }}>
                  <Link
                    to="/mylisting"
                    onClick={() => window.history.back()}
                    className="go-back-link-wrapper"
                  >
                    <h6 className="d-flex justify-content-beetween font-weight-light m-2 go-back-link p-2">
                      <MdArrowBackIos className="back-icon" /> Retour
                    </h6>
                  </Link>
                </div>

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
                    <div className="row mt-3" ref={gridContainerRef}>
                      {gridWidth > 0 && (
                        <Grid
                          ref={gridRef}
                          columnCount={columnCount}
                          columnWidth={Math.floor(gridWidth / columnCount)}
                          height={window.innerHeight - 80} // Adjust for header
                          rowCount={Math.ceil(usersProperties.length / columnCount)}
                          rowHeight={ItemSize}
                          width={gridWidth}
                          itemData={usersProperties}
                        >
                          {Cell}
                        </Grid>
                      )}
                    </div>
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

          <div className="fixed-bottom d-flex justify-content-end w-100">
            <button
              onClick={() => setLocation("/create-listing")}
              className="btn btn-success quick-add-ad-btn mb-4 mr-3"
              aria-label="Créer une nouvelle annonce"
            >
              +
            </button>
          </div>
        </>
      ) : (
        <NotLogedIn />
      )}
    </div>
  );
};

export default MyHouseListingPage;