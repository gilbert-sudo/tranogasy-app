import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { FixedSizeList as List } from "react-window";
import "./css/custom.css";

const PropertyCarousel = ({ visibleProperties, onItemClick }) => {
    const searchForm = useSelector((state) => state.searchForm);
    const [currentImageIndexes, setCurrentImageIndexes] = useState({});
    const [focusedPropertyId, setFocusedPropertyId] = useState(null);

    const listRef = useRef();
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    const selectedPropertyId = searchForm.selectedProperty && searchForm.selectedProperty._id;
    

    useEffect(() => {
        const initIndexes = {};
        visibleProperties.forEach((prop) => {
            initIndexes[prop._id] = 0;
        });
        setCurrentImageIndexes(initIndexes);
    }, [visibleProperties]);

    useEffect(() => {
        if (!selectedPropertyId || !listRef.current) return;
        const index = visibleProperties.findIndex((prop) => prop._id === selectedPropertyId);
        if (index !== -1) {
            listRef.current.scrollToItem(index, "center");
            setFocusedPropertyId(selectedPropertyId);
        }
    }, [selectedPropertyId, visibleProperties]);

    const handleImageClick = (property, imagesLength) => {
        const propId = property._id;
        // Corrected precedence: ((prev[propId] ?? 0) + 1)
        // Call the onItemClick prop - this will cause the map to recenter
        onItemClick(property, null, false);
        setTimeout(() => {
            setCurrentImageIndexes((prev) => {
                const nextIndex = ((prev[propId] ?? 0) + 1) % imagesLength;
                return {
                    ...prev,
                    [propId]: nextIndex,
                };
            });
        }, 100);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const scrollBy = (offset) => {
        if (listRef.current) {
            const container = listRef.current._outerRef;
            if (container) {
                container.scrollBy({
                    left: offset,
                    behavior: "smooth",
                });
            }
        }
    };


    const Row = useCallback(
        ({ index, style }) => {
            const property = visibleProperties[index];
            const images = property.images?.map((img) => img.src) || ["/default.jpg"];
            const currentImageIndex = currentImageIndexes[property._id] || 0;
            const currentImage = images[currentImageIndex];
            const isFocused = focusedPropertyId === property._id;

            return (
                <div
                    className="property-card"
                    key={property._id}
                    style={{
                        ...style,
                        paddingLeft: "17px",
                    }}
                >
                    <div
                        onClick={() => handleImageClick(property, images.length)}
                        style={{
                            width: "240px",
                            height: "150px",
                            marginTop: "10px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            position: "relative",
                            flexShrink: 0,
                            cursor: "pointer",
                            border: isFocused ? "2px solid transparent" : "2px solid rgba(255, 255, 255, 0.7)", // white border when not focused
                            outline: isFocused ? "2px solid rgba(255, 0, 0, 0.8)" : "none", // red outline when focused
                            boxShadow: isFocused ? "0 8px 20px rgba(255, 0, 0, 0.4)" : "none",
                            transform: isFocused ? "scale(1.02)" : "scale(1)",
                            transition: "all 0.25s ease",
                        }}
                        tabIndex={0} // Make the div focusable
                        onFocus={() => setFocusedPropertyId(property._id)}
                        onBlur={() => setFocusedPropertyId(null)} // Remove focus when blurred
                    >
                        <img
                            src={currentImage}
                            alt={property.title}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                            loading="lazy"
                        />

                        {/* Story indicators */}
                        <div
                            style={{
                                position: "absolute",
                                top: 8,
                                left: "50%",
                                transform: "translateX(-50%)",
                                display: "flex",
                                gap: "4px",
                            }}
                        >
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: "20px",
                                        height: "3px",
                                        backgroundColor:
                                            idx <= currentImageIndex ? "#fff" : "rgba(255,255,255,0.4)",
                                        borderRadius: "2px",
                                        transition: "background-color 0.3s",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Date tag */}
                        <div
                            style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                background: "rgba(0,0,0,0.5)",
                                color: "#fff",
                                fontSize: "12px",
                                padding: "2px 6px",
                                borderRadius: "6px",
                            }}
                        >
                            {formatDate(property.created_at)}
                        </div>

                        {/* Bottom gradient text */}
                        <div
                            onClick={() => {
                                onItemClick(property, null, true);
                            }}
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: "0px 8px 8px 8px",
                                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                                color: "#fff",
                                fontWeight: "bold",
                            }}
                        >
                            <small>
                                <strong>
                                    {property.rent && (property.rent.toLocaleString("en-US") || "Prix sur demande")}{" "}
                                    <small>Ar/mois</small>
                                </strong>
                            </small>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontFamily:
                                        "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {property.title}
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
        [visibleProperties, currentImageIndexes, onItemClick]
    );

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    bottom: 46,
                    left: 0,
                    right: 0,
                }}
            >
                <List
                    height={170}
                    overflow="hidden"
                    itemCount={visibleProperties.length}
                    itemSize={252} // Card width + padding
                    layout="horizontal"
                    width={window.innerWidth}
                    ref={listRef}
                >
                    {Row}
                </List>
            </div>

            {isDesktop && (
                <>
                    <button
                        onClick={() => scrollBy(-520)}
                        style={{
                            position: "absolute",
                            left: 10,
                            width: "50px",
                            height: "50px",
                            bottom: 110,
                            background: "rgba(0,0,0,0.7)",
                            border: "none",
                            color: "white",
                            fontSize: "32px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            padding: "5px 10px 10px 7px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        ‹
                    </button>
                    <button
                        onClick={() => scrollBy(520)}
                        style={{
                            position: "absolute",
                            right: 10,
                            width: "50px",
                            height: "50px",
                            bottom: 110,
                            background: "rgba(0,0,0,0.7)",
                            border: "none",
                            color: "white",
                            fontSize: "32px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            padding: "5px 7px 10px 10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        ›
                    </button>
                </>
            )}
        </>
    );
};


export default PropertyCarousel;
