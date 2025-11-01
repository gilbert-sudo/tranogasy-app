import { useEffect } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Phone, SendHorizontal } from "lucide-react";
import { ImLocation } from "react-icons/im";
import { MdOutlineTipsAndUpdates } from "react-icons/md";

import { usePopup } from "../hooks/usePopup";
import { useFormater } from "../hooks/useFormater";

import userProfile from "../img/user-avatar.png";

export default function ContactCard({ setShowContact, property }) {

    const { formatPhone } = useFormater();
    const { featureUnderConstructionPopup } = usePopup();

    const numbers = [property.phone1, property.phone2, property.phone3].map(formatPhone);

    // Handle backdrop click to close the modal
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowContact(false);
        }
    };

    // lock scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10000,
                    display: "block",
                    padding: "10px",
                }}
            >
                {/* Semi-transparent backdrop */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 10,
                        cursor: "pointer",
                        minHeight: "100vh",
                    }}
                    onClick={handleBackdropClick}
                />
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            marginLeft: "50%",
                            marginRight: "auto",
                            transform: "translateX(-50%)",
                            position: "absolute",
                            minHeight: "100%",
                            maxWidth: "500px",
                            top: "-65vh",
                            padding: "20px 15px",
                            backgroundColor: "white",
                            borderRadius: "20px",
                            zIndex: 3000,
                            overflowY: "auto",
                        }}
                    >
                        {/* Close button */}
                        <IoMdCloseCircle
                            style={{
                                fontSize: "2rem",
                                position: "absolute",
                                top: "15px",
                                right: "15px",
                                zIndex: 9999,
                                backgroundColor: "#fff",
                                borderRadius: "50%",
                                cursor: "pointer",
                                color: "#333",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            }}
                            onClick={() => setShowContact(false)}
                        />

                        {/* Property Info */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "20px",
                                padding: "12px",
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                background: "#fafafa",
                            }}
                        >
                            <img
                                src={property.images?.[0]?.src || property.owner?.avatar || userProfile}
                                alt={property.title}
                                style={{
                                    width: "65px",
                                    height: "65px",
                                    borderRadius: "12px",
                                    objectFit: "cover",
                                    marginRight: "12px",
                                }}
                            />
                            <div>
                                <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#333" }}>
                                    {property.title}
                                </p>
                                <p style={{ margin: "3px 0 0 0", fontSize: "12px", color: "#666" }}>
                                    <ImLocation style={{ marginRight: "4px", color: "#d9534f" }} />
                                    {property.city.fokontany}, {property.city.commune}, {property.city.district}
                                </p>
                            </div>
                        </div>

                        {/* Phone Numbers */}
                        <div style={{ marginBottom: "20px" }}>
                            <h4 style={{ margin: "0 0 10px 0", fontSize: "15px", fontWeight: "500", color: "#333" }}>
                                Numéros de contact
                            </h4>
                            {numbers.map(
                                (num, i) =>
                                    num && (
                                        <a
                                            key={i}
                                            href={`tel:${num.replace(/\s/g, '')}`} // Remove spaces for tel link
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: "12px",
                                                marginBottom: "8px",
                                                backgroundColor: "#f9f9f9",
                                                border: "1px solid #ddd",
                                                borderRadius: "30px",
                                                color: "#333",
                                                fontWeight: "500",
                                                textDecoration: "none",
                                                transition: "all 0.2s ease",
                                            }}
                                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                                        >
                                            <Phone size={18} style={{ marginRight: "10px", color: "#666" }} />
                                            {num}
                                        </a>
                                    )
                            )}
                            {!numbers.some(Boolean) && (
                                <p
                                    style={{
                                        padding: "12px",
                                        backgroundColor: "#fff4e6",
                                        borderRadius: "10px",
                                        color: "#cc7a00",
                                        margin: 0,
                                        textAlign: "center",
                                    }}
                                >
                                    Aucun numéro de contact disponible
                                </p>
                            )}
                        </div>

                        {/* Other Options */}
                        <div>
                            <h4 style={{ margin: "0 0 10px 0", fontSize: "15px", fontWeight: "500", color: "#333" }}>
                                Autres options
                            </h4>
                            <button
                                onClick={featureUnderConstructionPopup}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100%",
                                    padding: "12px 15px",
                                    borderRadius: "30px",
                                    backgroundColor: "#333",
                                    color: "#fff",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    marginBottom: "10px",
                                    border: "none",
                                }}
                            >
                                <SendHorizontal size={18} style={{ marginRight: "10px" }} />
                                Envoyer un message
                            </button>
                        </div>

                        {/* Tip */}
                        <div
                            style={{
                                marginTop: "20px",
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
                                <strong> <MdOutlineTipsAndUpdates size={18} className="mb-1" /></strong> Appelez entre 9h et 18h pour une réponse rapide
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}