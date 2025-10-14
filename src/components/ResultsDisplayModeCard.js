import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoMdCloseCircle } from "react-icons/io";
import { BsTiktok, BsViewList } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

const ResultsDisplayModeCard = ({ setShowResultsDisplayModeCard, handleCloseSlideClick }) => {
    const [isMounted, setIsMounted] = useState(false);

    // Handle backdrop click to close the modal
    const handleBackdropClick = () => {
        setShowResultsDisplayModeCard(false);
    };

    useEffect(() => {
        const body = document.body;

        if (body) {
            body.style.overflow = 'hidden';
        }

        // Trigger animation after component mounts
        setTimeout(() => {
            setIsMounted(true);
        }, 50);

        return () => {
            body.style.overflow = '';
        };
    }, []);

    return (
        <>
            {/* Semi-transparent backdrop with fade animation */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 2000,
                    cursor: "pointer",
                    opacity: isMounted ? 1 : 0,
                    transition: "opacity 0.3s ease-out",
                }}
                onClick={handleBackdropClick}
            />

            {/* Fixed modal with faster spring-like animation */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: isMounted 
                        ? "translate(-50%, -50%) scale(1) rotate(0deg)" 
                        : "translate(-50%, -50%) scale(0.3) rotate(-5deg)",
                    maxWidth: "500px",
                    width: "calc(100% - 40px)",
                    maxHeight: "calc(100vh - 40px)",
                    padding: "20px 15px",
                    backgroundColor: "white",
                    borderRadius: "20px",
                    zIndex: 3000,
                    overflowY: "auto",
                    boxShadow: isMounted 
                        ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" 
                        : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    opacity: isMounted ? 1 : 0,
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    willChange: "transform, opacity",
                    scrollbarWidth: "none"
                }}
            >
                {/* Close button with faster bounce animation */}
                <IoMdCloseCircle
                    style={{
                        fontSize: "2rem",
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        zIndex: 9999,
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        cursor: "pointer",
                        color: "#333",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        opacity: isMounted ? 1 : 0,
                        transform: isMounted ? "scale(1)" : "scale(0)",
                        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s",
                    }}
                    onClick={() => setShowResultsDisplayModeCard(false)}
                />

                {/* Titre with faster slide-up animation */}
                <h2
                    style={{
                        fontWeight: "700",
                        fontSize: "1.25rem",
                        marginBottom: "10px",
                        color: "#222",
                        opacity: isMounted ? 1 : 0,
                        transform: isMounted ? "translateY(0)" : "translateY(20px)",
                        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s",
                    }}
                >
                    Comment veux-tu voir les résultats ?
                </h2>

                {/* Description with faster slide-up animation */}
                <p
                    style={{
                        fontSize: "0.95rem",
                        color: "#666",
                        marginBottom: "22px",
                        opacity: isMounted ? 1 : 0,
                        transform: isMounted ? "translateY(0)" : "translateY(20px)",
                        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s",
                    }}
                >
                    Choisis ton mode d'affichage préféré 💕
                </p>

                {/* Boutons container - MUCH FASTER */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        width: "100%",
                        opacity: isMounted ? 1 : 0,
                        transform: isMounted ? "translateY(0)" : "translateY(20px)",
                        transition: "all 0.25s ease-out 0.2s",
                    }}
                >
                    {/* Button 1 with much faster animation */}
                    <button
                        style={{
                            ...optionStyle("#000", "#fff"),
                            opacity: isMounted ? 1 : 0,
                            transform: isMounted ? "translateX(0)" : "translateX(-30px)",
                            transition: "all 0.25s ease-out 0.25s",
                        }}
                        onClick={() => console.log("Mode TikTok sélectionné")}
                    >
                        <BsTiktok style={{ fontSize: "1.5rem", marginRight: "10px" }} />
                        Mode TikTok
                    </button>

                    {/* Button 2 with much faster animation */}
                    <button
                        style={{
                            ...optionStyle("#ffffff", "#000000", true),
                            opacity: isMounted ? 1 : 0,
                            transform: isMounted ? "translateX(0)" : "translateX(30px)",
                            transition: "all 0.25s ease-out 0.3s",
                        }}
                        onClick={() => {
                            handleCloseSlideClick();
                            setShowResultsDisplayModeCard(false);
                        }}
                    >
                        <FcGoogle style={{ fontSize: "1.5rem", marginRight: "10px" }} />
                        Mode Carte
                    </button>

                    {/* Button 3 with much faster animation */}
                    <button
                        style={{
                            ...optionStyle("#7cbd1e", "#fff"),
                            opacity: isMounted ? 1 : 0,
                            transform: isMounted ? "translateX(0)" : "translateX(-30px)",
                            transition: "all 0.25s ease-out 0.35s",
                        }}
                        onClick={() => console.log("Mode Liste sélectionné")}
                    >
                        <BsViewList style={{ fontSize: "1.5rem", marginRight: "10px" }} />
                        Mode Liste
                    </button>
                </div>
            </div>
        </>
    );
}

// Style réutilisable des boutons
const optionStyle = (bg, color, isOutlined = false) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: isOutlined ? "#fff" : bg,
    color,
    padding: "14px 18px",
    borderRadius: "30px",
    border: isOutlined ? `2px solid #f23a2e` : "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    width: "100%",
    textTransform: "capitalize",
    letterSpacing: "0.3px",
    outline: "none",
    appearance: "none",
});

export default ResultsDisplayModeCard;