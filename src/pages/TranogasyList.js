
import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTranogasyListField } from "../redux/redux";

import PropertyDetails from "../components/PropertyDetails";
import PlaceAutocompleteClassic from "../components/PlaceAutocompleteClassic";
import MyListingDetailsSkeleton from "../components/skeletons/MyListingDetailsSkeleton";

import PropertyDetailsPage from "./PropertyDetailsPage";

import { MdArrowBackIos } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { BsSearch } from "react-icons/bs";
import { IoMdCloseCircle } from "react-icons/io";
import { useImage } from "../hooks/useImage";
import { FixedSizeGrid as Grid } from "react-window";
import { StepBack, StepForward } from "lucide-react";



const TranogasyList = ({ payload, route, setListViewMode }) => {
    const properties = payload;
    const tranogasyMap = useSelector((state) => state.tranogasyMap);
    const tranogasyList = useSelector((state) => state.tranogasyList);

    const dispatch = useDispatch();
    const { noInputValueForSearchImg, noSearchResultImg } = useImage();

    const gridContainerRef = useRef();
    const gridRef = useRef();
    const [gridWidth, setGridWidth] = useState(0);
    const [columnCount, setColumnCount] = useState(3);

    const [showSearchInput, setShowSearchInput] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchResult, setSearchResult] = useState(null);

    const [currentRow, setCurrentRow] = useState(0);

    const totalRows = Math.ceil(properties.length / columnCount);
    const rowsPerStep = 10 / columnCount; // how many rows ≈ 10 items
    const maxRow = Math.max(totalRows - 1, 0);

    const itemsPerPage = columnCount * 10; // since each "step" moves 10 items
    const currentPage = Math.floor((currentRow * columnCount) / itemsPerPage) + 1;
    const totalPages = Math.ceil(properties.length / itemsPerPage);

    const handleStepForward = () => {
        if (gridRef.current) {
            const newRow = Math.min(currentRow + rowsPerStep, maxRow);
            const scrollTop = newRow * ((ItemSize / 100) * 106); // row height in px
            gridRef.current.scrollTo({
                scrollTop,
                behavior: "smooth"
            });

            setCurrentRow(newRow);
        }
    };

    const handleStepBack = () => {
        if (gridRef.current) {
            const newRow = Math.max(currentRow - rowsPerStep, 0);
            const scrollTop = newRow * ((ItemSize / 100) * 106);
            gridRef.current.scrollTo({
                scrollTop,
                behavior: "smooth"
            });

            setCurrentRow(newRow);
        }
    };

    const handleCloseSlideClick = () => {
        dispatch(setTranogasyListField({ key: "isListViewSliderVisible", value: false }));
    };
    

    //handle property search
    function searchListedProperty(propertyNumber) {
        console.log("proertyNumber", Number(propertyNumber), properties);
        const property = properties.filter((prop) => prop.propertyNumber === Number(propertyNumber));
        setSearchResult(property);
        console.log("Form submited, search results", property);
    }
    //search input toggle effect
    const inputRef = useRef(null);

    useEffect(() => {
        if (showSearchInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showSearchInput]);

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
    }, [properties]);

    useEffect(() => {
        const body = document.body;

        if (body) {
            body.style.overflow = 'hidden';
        }

        return () => {
            body.style.overflow = '';
        };
    }, [tranogasyMap.formFilter]);

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.scrollTo({ scrollTop: 0, scrollLeft: 0 });
            handleCloseSlideClick();
            setCurrentRow(0);
        }
    }, [properties]);

    const ItemSize = 400;

    const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex;
        const property = properties?.[index];

        if (!property || !properties || !properties.length > 0) return null;

        return (
            <div
                style={style}
            >
                <div
                    style={{ padding: '8px', height: '100%' }}
                >
                    <PropertyDetails
                        key={property._id}
                        property={property}
                        route={"TranogasyList"}
                    />
                </div>
            </div>
        );
    }, [columnCount, properties]);

    return (
        <div className="mylisting">
            {!tranogasyList.isListViewSliderVisible &&
                <div className="position-absolute"
                    style={{
                        zIndex: 2
                    }}
                >
                    <PlaceAutocompleteClassic onPlaceSelect={() => { }} isSearchResult={true} />
                </div>
            }
            <div className="mylisting mt-2 pt-1">
                <div className="site-section site-section-sm bg-light">
                    <div className="custom-container"
                        style={{
                            ...(showSearchInput
                                ? { paddingTop: "9dvh" }
                                : { paddingBottom: "9dvh" }),
                        }}
                    >
                        {properties && properties.length > 0 ?
                            (
                                <>
                                    <div className="row" ref={gridContainerRef} style={{ display: showSearchInput ? "none" : "block" }}>
                                        {gridWidth > 0 && (
                                            <Grid
                                                ref={gridRef}
                                                columnCount={columnCount}
                                                columnWidth={Math.floor(gridWidth / columnCount)}
                                                height={window.innerHeight - (showSearchInput ? 150 : 80)}
                                                rowCount={Math.ceil(properties.length / columnCount)}
                                                rowHeight={(ItemSize / 100) * 106}
                                                width={(gridWidth / 100) * 101.5}
                                                itemData={properties}
                                                style={{ paddingBottom: "100px" }}
                                                onScroll={({ scrollTop }) => {
                                                    const newRow = Math.floor(scrollTop / ((ItemSize / 100) * 106));
                                                    setCurrentRow(newRow);
                                                }}
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
                                            {searchResult && searchResult.length === 0 && (
                                                <>
                                                    {route === "searchResult" && (
                                                        <p style={{ fontWeight: "400" }} className="m-2">
                                                            Ce numéro ne correspond à aucune propriété.
                                                        </p>
                                                    )}
                                                    {route !== "searchResult" && (
                                                        <p style={{ fontWeight: "400" }} className="m-2">
                                                            Ce numéro ne correspond à aucun bien que vous possédez.
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </center>
                                        {searchResult && searchResult.length > 0 &&
                                            <div style={{ height: '100%', maxWidth: '400px' }}>
                                                <PropertyDetails
                                                    property={searchResult[0]}
                                                    route={"TranogasyList"}
                                                />
                                            </div>
                                        }
                                    </div>
                                    <div
                                        className={`property-details-slide ${tranogasyList.isListViewSliderVisible ? "show" : ""}`}
                                        style={{
                                            position: "fixed",
                                            left: "50%",
                                            bottom: 0,
                                            transform: tranogasyList.isListViewSliderVisible
                                                ? "translate(-50%, 0)"
                                                : "translate(-50%, 100%)",
                                            width: "100%",
                                            height: "95dvh",
                                            overflowY: "auto",
                                            backgroundColor: "#fff",
                                            borderRadius: "30px 30px 0 0",
                                            boxShadow: "0 -1px 12px hsla(var(--hue), var(--sat), 15%, 0.30)",
                                            transition: "transform 0.5s ease",
                                            boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
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
                                                }}
                                                onClick={handleCloseSlideClick}
                                            />
                                        </div>
                                        {/* Close button to hide the sliding div */}
                                        {tranogasyList.selectedProperty && !tranogasyMap.formFilter && tranogasyList.isListViewSliderVisible && (
                                            <PropertyDetailsPage
                                                key={tranogasyList.selectedProperty._id}
                                                fastPreviewProperty={tranogasyList.selectedProperty}
                                                handleCloseSlideClick={handleCloseSlideClick}
                                            />
                                        )}

                                    </div>
                                </>
                            )
                            :
                            (
                                <div className="row mt-3">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <MyListingDetailsSkeleton key={index} />
                                    ))}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            {!tranogasyList.isListViewSliderVisible &&
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
                        <>
                            <button
                                type="button"
                                className="btn btn-outline-dark d-flex align-items-center justify-content-center"
                                onClick={handleStepBack}
                                disabled={currentRow <= 0}
                                style={{
                                    borderRadius: "30px",
                                    opacity: currentRow <= 0 ? 0.4 : 1,
                                    cursor: currentRow <= 0 ? "not-allowed" : "pointer",
                                    padding: 10,
                                    border: "none"
                                }}
                            >
                                <StepBack />
                            </button>
                            <div className="text-center w-100" style={{ fontSize: "14px", fontWeight: "500" }}>
                                <small>Page</small> <br /> {currentPage} / {totalPages}
                            </div>
                        </>
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
                                    searchListedProperty(searchInput);
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
                                type="button"
                                className="btn btn-success d-flex align-items-center justify-content-center ml-2"
                                onClick={handleStepForward}
                                disabled={currentRow >= maxRow - rowsPerStep}
                                style={{
                                    borderRadius: "30px",
                                    opacity: currentRow >= maxRow - rowsPerStep ? 0.4 : 1,
                                    cursor: currentRow >= maxRow - rowsPerStep ? "not-allowed" : "pointer",
                                    padding: "12px 10px"
                                }}
                            >
                                <span className="me-1">Page suivante</span>
                                <StepForward />
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
            }
        </div>
    );
};

export default TranogasyList;