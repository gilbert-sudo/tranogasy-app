import { useRef, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useDispatch, useSelector } from "react-redux";
import { setSearchFormField } from "../redux/redux";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import "./css/googlemaps.css";
// import { LiaBinocularsSolid } from "react-icons/lia";
import { FaSearchLocation } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

const PlaceAutocompleteClassic = ({ onPlaceSelect, setPlaceName }) => {

    const searchForm = useSelector((state) => state.searchForm);

    const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const places = useMapsLibrary("places");
    const [location,] = useLocation(false);

    const [isSearchPage, setIsSearchPage] = useState(false);

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            componentRestrictions: { country: "mg" },
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
        (location === "/tranogasyMap") ? setIsSearchPage(true) : setIsSearchPage(false);
    }, [location]);

    useEffect(() => {
        if (!placeAutocomplete) return;
        placeAutocomplete.addListener("place_changed", () => {
            if (!placeAutocomplete.getPlace().geometry) {
                console.log("No details available for input: '" + placeAutocomplete.getPlace().name + "'");
            } else {
                if (isSearchPage) {
                    dispatch(setSearchFormField({
                        key: "searchCoordinates", value: {
                            lat: placeAutocomplete.getPlace().geometry.location.lat(),
                            lng: placeAutocomplete.getPlace().geometry.location.lng(),
                        }
                    }));
                    dispatch(setSearchFormField({ key: "address", value: placeAutocomplete.getPlace().name }));
                    dispatch(setSearchFormField({ key: "searchRadius", value: 1000 })); // default 1km radius
                }
                onPlaceSelect({
                    lat: placeAutocomplete.getPlace().geometry.location.lat(),
                    lng: placeAutocomplete.getPlace().geometry.location.lng(),
                });
                setPlaceName(placeAutocomplete.getPlace().name);
            }
        });
    }, [onPlaceSelect, placeAutocomplete]);

    // Function to clear the input value
    const clearInput = () => {
        if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.focus();
            onPlaceSelect(null);

            if (isSearchPage) {
                dispatch(setSearchFormField({ key: "searchCoordinates", value: null }));
                dispatch(setSearchFormField({ key: "address", value: null }));
                dispatch(setSearchFormField({ key: "searchRadius", value: null }));
            }

            // Trigger input event to reset Google Autocomplete
            const event = new Event('input', { bubbles: true });
            inputRef.current.dispatchEvent(event);
        }
    };

    return (
        <>
            <div style={{ position: "relative" }}>
                <FaSearchLocation
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "12px",
                        transform: "translateY(-50%)",
                        color: "#6b7280",
                        fontSize: "18px",
                    }}
                />
                <input
                    className="map-input"
                    type="search"
                    placeholder="Où que ce soit à Madagascar"
                    required
                    style={{
                        width: "100%",
                        padding: "15px 15px 15px 40px",
                        border: "1px solid #ced4da",
                        borderRadius: "20px",
                        fontSize: "16px",
                        outline: "none",
                        transition: "border-color 0.2s",
                        backgroundColor: "#f9f9f9",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#6b7280")}
                    onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
                    ref={inputRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") e.preventDefault();
                    }}
                    {...(isSearchPage
                        ? {
                            value: searchForm.address,
                            onChange: (e) =>
                                dispatch(
                                    setSearchFormField({ key: "address", value: e.target.value })
                                ),
                        }
                        : {})}
                />

                {/* Clear button (X) - only shown when there's text */}
                {searchForm.address && (
                    <button
                        onClick={clearInput}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#999",
                            transition: "color 0.2s, background 0.2s",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.color = "#666";
                            e.currentTarget.style.background = "#f0f0f0";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.color = "#999";
                            e.currentTarget.style.background = "transparent";
                        }}
                        aria-label="Clear input"
                        type="button"
                    >
                        <IoMdCloseCircle size={20} />
                    </button>
                )}
            </div>
        </>
    );
};

export default PlaceAutocompleteClassic;