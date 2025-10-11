import { useEffect } from "react";
import { useSelector } from "react-redux";
import PropertyDetails from "../components/PropertyDetails";
import { IoMdCloseCircle } from "react-icons/io";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { FolderClock, MegaphoneOff } from "lucide-react";

const PropertyExistsCard = ({ handlePursueTheSubmit, property, setPropertyExistsCard, setIsSlideVisible, setRecoveryData }) => {

    //redux
    const user = useSelector((state) => state.user);

    // Handle backdrop click to close the modal
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setPropertyExistsCard(null);
        }
    };

    const handleUpdateListing = () => {
        setPropertyExistsCard(null);
        setRecoveryData(property);
        console.log("set the proerty", property);
        setTimeout(() => {
            handlePursueTheSubmit(false);
        }, 100);
    };

    const createdAt = new Date(property.created_at);
    const now = new Date();

    // difference in milliseconds
    const diffTime = Math.abs(now - createdAt);

    // convert to days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    console.log(`${diffDays}  days ago`);

    useEffect(() => {
        const body = document.body;

        if (body) {
            // Lock scroll by setting overflow to hidden
            body.style.overflow = 'hidden';
        }

        return () => {
            body.style.overflow = '';
        };
    }, []);


    return (
        <>
            {/* Semi-transparent backdrop */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 10,
                    cursor: "pointer",
                }}
                onClick={handleBackdropClick}
            />

            {/* Fixed modal positioned at center of screen */}
            <div
                className="custom-property-modal"
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: "500px",
                    width: "calc(100% - 40px)", // Account for 20px margin on each side
                    maxHeight: "calc(100vh - 40px)", // Account for 20px margin top and bottom
                    padding: "20px 15px",
                    backgroundColor: "white",
                    borderRadius: "20px",
                    zIndex: 3000,
                    overflowY: "auto",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                }}
            >
                {/* Close button */}
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
                    }}
                    onClick={() => setPropertyExistsCard(null)}
                />

                {/* Error message */}
                <div className="mb-2">
                    <p
                        style={{
                            padding: "10px",
                            backgroundColor: "#ffe6e6ff",
                            borderRadius: "15px",
                            color: "#cc0000ff",
                            marginBottom: 0,
                            fontSize: "0.9rem",
                            textAlign: "center",
                        }}
                    >
                        La propriété que vous tentez d'ajouter existe peut être déjà.
                    </p>
                </div>

                {/* Property Info */}
                <div
                    onClick={() => {
                        setIsSlideVisible(true);
                    }}
                    style={{
                        cursor: "pointer",
                        marginBottom: "5px"
                    }}
                >
                    <PropertyDetails
                        key={property._id}
                        property={property}
                        route={"PropertyExistsCard"}
                    />
                </div>
                {/* Other Options */}
                {user && (
                    <>
                        <div className="more-option">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePursueTheSubmit(true);
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100%",
                                    padding: "12px 15px",
                                    borderRadius: "30px",
                                    backgroundColor: "#555", // soft gray
                                    color: "#fff",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    marginBottom: "10px",
                                    border: "none",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#555")}
                            >
                                <MegaphoneOff size={18} style={{ marginRight: "10px" }} />
                                Non, ce n'est pas la même
                            </button>
                        </div>

                        <div className="more-option">
                            {diffDays &&
                                (diffDays > 7) ?
                                (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleUpdateListing}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "100%",
                                                padding: "12px 15px",
                                                borderRadius: "30px",
                                                backgroundColor: "#6BCB2D", // TranoGasy green tone
                                                color: "#fff",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                marginBottom: "10px",
                                                border: "none",
                                                boxShadow: "0 3px 8px rgba(107, 203, 45, 0.3)",
                                                transition: "all 0.3s ease",
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5AAE26")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6BCB2D")}
                                        >
                                            <FolderClock size={18} style={{ marginRight: "10px" }} />
                                            Oui, récupérer cette annonce
                                        </button>
                                        {/* Tip */}
                                        <div
                                            style={{
                                                marginTop: "10px",
                                                padding: "8.4px 10.5px",
                                                borderRadius: "12px",
                                                backgroundColor: "#f3faea",
                                                fontSize: "13px",
                                                color: "#7cbd1e",
                                                textAlign: "center",
                                                fontWeight: "500",
                                            }}
                                        >
                                            <p style={{ margin: 0 }}>
                                                <strong> <MdOutlineTipsAndUpdates size={18} className="mb-1" /></strong> Le délai de cette annonce est expiré il y a {diffDays - 7} jour{(diffDays - 7) > 1 && "s"}. Vous pouvez maintenant la récupérer.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Tip */}
                                        <div
                                            style={{
                                                marginTop: "10px",
                                                padding: "8.4px 10.5px",
                                                borderRadius: "12px",
                                                backgroundColor: "#ffe6e6ff",
                                                fontSize: "13px",
                                                color: "#cc0000ff",
                                                textAlign: "center",
                                                fontWeight: "500",
                                            }}
                                        >
                                            <p style={{ margin: 0 }}>
                                                <strong> <MdOutlineTipsAndUpdates size={18} className="mb-1" /></strong> Après l'expiration du délai de cette annonce dans {7 - diffDays} jour{(7 - diffDays) > 1 && "s"}, vous pourriez la récupérer à ce moment-là.
                                            </p>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </>
                )}

            </div>
        </>
    );
}

export default PropertyExistsCard;