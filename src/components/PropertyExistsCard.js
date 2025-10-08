import { useEffect } from "react";
import PropertyDetails from "../components/PropertyDetails";
import { IoMdCloseCircle } from "react-icons/io";
import { Phone, SendHorizontal } from "lucide-react";
import { ImLocation } from "react-icons/im";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { RxCross2, RxUpdate } from "react-icons/rx";

import { usePopup } from "../hooks/usePopup";

import userProfile from "../img/user-avatar.png";

const formatPhone = (phone) => {
    if (!phone) return null;

    // Remove all non-digit characters except plus at the beginning
    let digits = phone.replace(/\D/g, "");

    // Check if the original had a plus to preserve it
    const hadPlus = phone.trim().startsWith('+');

    // Handle different input formats
    if (digits.startsWith("0")) {
        digits = "261" + digits.substring(1);
    } else if (digits.startsWith("261")) {
        // Already in correct format
        digits = digits;
    } else if (!digits.startsWith("261") && digits.length === 9) {
        // Assume it's a local number without prefix
        digits = "261" + digits;
    } else if (digits.length === 12 && digits.startsWith("261")) {
        // Already in correct format without plus
        digits = digits;
    }

    // Add the plus sign if it was there originally or we're formatting an international number
    const shouldAddPlus = hadPlus || digits.length >= 9;
    const prefix = shouldAddPlus ? "+" : "";

    // Format with spaces for better readability
    if (digits.length === 12 && digits.startsWith("261")) {
        // Format: +261 XX XX XXX XX
        return `${prefix}${digits.substring(0, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 7)} ${digits.substring(7, 10)} ${digits.substring(10)}`;
    } else if (digits.length === 9) {
        // Format local numbers differently: XXX XX XXX XX
        return `${digits.substring(0, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 8)} ${digits.substring(8)}`;
    }

    // Fallback for other formats
    return prefix + digits;
};

const PropertyExistsCard = ({ setErrorCard }) => {

    const property = {
        "coords": null,
        "phone3": null,
        "houseType": null,
        "floor": null,
        "_id": "66e5ab923b01e65e8fca8cb4",
        "title": "Maison à vendre ",
        "description": "Maison 1 chambre, living et cuisine \n",
        "city": {
            "coords": {
                "lat": -18.9385007,
                "lng": 47.5220186
            },
            "stats": {
                "averagePrice": 60000000,
                "averageRent": 653333.3333333334,
                "lastUpdated": "2025-09-30T09:39:47.502Z",
                "propertyCount": 4
            },
            "_id": "64f75284ef8f606073e9826a",
            "province": "antananarivo",
            "region": "analamanga",
            "district": "antananarivo renivohitra",
            "commune": "4e arrondissement",
            "fokontany": "soanierana III-I cite gare",
            "__v": 0,
            "id": "64f75284ef8f606073e9826a"
        },
        "price": 60000000,
        "rent": null,
        "rooms": 1,
        "toilet": 1,
        "kitchen": 1,
        "bathrooms": 1,
        "livingRoom": 1,
        "phone1": "0381118326",
        "phone2": null,
        "topProperty": false,
        "area": 800,
        "propertyNumber": 531,
        "features": {
            "elevator": false,
            "garden": false,
            "courtyard": false,
            "balcony": false,
            "roofTop": false,
            "independentHouse": false,
            "garage": false,
            "guardianHouse": false,
            "bassin": false,
            "placardKitchen": false,
            "bathtub": false,
            "fireplace": false,
            "hotWaterAvailable": false,
            "furnishedProperty": false,
            "fiberOpticReady": false,
            "seaView": false,
            "mountainView": false,
            "panoramicView": false,
            "solarPanels": false,
            "_id": "66e5ab923b01e65e8fca8cb2",
            "motoAccess": true,
            "carAccess": true,
            "wifiAvailability": true,
            "parkingSpaceAvailable": false,
            "waterPumpSupply": true,
            "electricityPower": true,
            "securitySystem": true,
            "waterWellSupply": true,
            "surroundedByWalls": true,
            "electricityJirama": true,
            "waterPumpSupplyJirama": true,
            "kitchenFacilities": true,
            "airConditionerAvailable": true,
            "smokeDetectorsAvailable": false,
            "terrace": true,
            "swimmingPool": false,
            "insideToilet": true,
            "insideBathroom": true,
            "__v": 0
        },
        "images": [
            {
                "src": "https://storage.googleapis.com/tranogasy-images/1726327665085_blob",
                "width": 685,
                "height": 455
            },
            {
                "src": "https://storage.googleapis.com/tranogasy-images/1726327682425_blob",
                "width": 790,
                "height": 912
            },
            {
                "src": "https://storage.googleapis.com/tranogasy-images/1726327687008_blob",
                "width": 1045,
                "height": 1045
            },
            {
                "src": "https://storage.googleapis.com/tranogasy-images/1726327690216_blob",
                "width": 577,
                "height": 576
            },
            {
                "src": "https://storage.googleapis.com/tranogasy-images/1726327693001_blob",
                "width": 279,
                "height": 181
            }
        ],
        "owner": {
            "role": "user",
            "_id": "66e5aaaf3b01e65e8fca8ca0",
            "username": "Belfah RAHARIJAONA ",
            "avatar": "https://storage.googleapis.com/tranogasy-images/1726328732519_blob"
        },
        "type": "sale",
        "status": "pending",
        "created_at": "2024-09-14T15:28:18.831Z",
        "updated_at": "2024-09-14T15:28:18.831Z",
        "__v": 0
    };

    const { featureUnderConstructionPopup } = usePopup();

    // Handle backdrop click to close the modal
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setErrorCard(false);
        }
    };

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
                        top: "15px",
                        right: "15px",
                        zIndex: 9999,
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        cursor: "pointer",
                        color: "#333",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                    onClick={() => setErrorCard(false)}
                />

                {/* Property Info */}
                <PropertyDetails
                    key={property._id}
                    property={property}
                    route={"ExplorePage"}
                />

                {/* Phone Numbers */}
                <div>
                    <div
                        style={{
                            display: "flex",
                            margin: "10px 0",
                            alignItems: "center",
                            padding: "5px 12px",
                            border: "1px solid #dcdcdc", // Soft light grey border (lighter than original #eee)
                            borderRadius: "30px",
                            background: "#f3f3f3", // Light grey background (darker than original #fafafa)
                        }}
                    >
                        <img
                            src={property.owner.avatar || userProfile}
                            alt={property.owner.username}
                            style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginRight: "12px",
                            }}
                        />
                        <div>
                            <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#222" }}>
                                {property.owner.username}
                            </p>
                            <small>
                                Propriétaire actuel
                            </small>
                            <p style={{ margin: "3px 0 0 0", fontSize: "12px", color: "#555" }}>
                                {/* Medium-dark grey secondary text */}
                                <Phone size={12} style={{ marginRight: "4px", color: "#d9534f" }} />
                                {formatPhone(property.phone1)}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p
                            style={{
                                padding: "12px",
                                backgroundColor: "#ffe6e6ff",
                                borderRadius: "10px",
                                color: "#cc0000ff",
                                marginBottom: 0,
                                textAlign: "center",
                            }}
                        >
                            La propriété que vous tentez d'ajouter existe déjà.
                        </p>
                    </div>
                </div>

                {/* Other Options */}
            </div>
        </>
    );
}

export default PropertyExistsCard;