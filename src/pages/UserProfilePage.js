import { useRoute } from "wouter";
import FavoritePropertyDetails from "../components/FavoritePropertyDetails";
import FavoritePropertyDetailsSkeleton from "../components/skeletons/FavoritePropertyDetailsSkeleton";
import { useSelector } from "react-redux";
import { useLoader } from "../hooks/useLoader";
import { useUser } from "../hooks/useUser";
import { useLogin } from "../hooks/useLogin";
import { useEffect, useState } from "react";
import { PiSmileySadThin } from "react-icons/pi";

//import css
import "./css/UserProfile.css";

//import user photo profil
import userProfile from "../img/user-avatar.png";

//import icons
import { ImLocation, ImPhone } from "react-icons/im";
import { MdArrowBackIos } from "react-icons/md";
import { BiSolidLike, BiCheck } from "react-icons/bi";

const UserProfilePage = () => {
    // redux
    const { getUserById } = useUser();
    const { notLogedPopUp } = useLogin();
    const { loadSpesificUsersProperties } = useLoader();
    const user = useSelector((state) => state.user);

    const [oneTimeTask, setOneTimeTask] = useState(null);

    if (oneTimeTask === null) {
        // scroll to top of the page
        window.scrollTo(0, 0);
        setOneTimeTask("done");
    }

    const [match, params] = useRoute("/userProfile/:userId");
    const userId = match ? params.userId : "";
    const [userData, setUserData] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [userProperties, setUserProperties] = useState(null);

    useEffect(() => {
        const pageLoader = async () => {
            if (!userData && userId) {
                (user && (userId === user._id)) ? setUserData(user) : setUserData(await getUserById(userId));
            }
            if (userData && !userProperties) {
                setUserProperties(await loadSpesificUsersProperties(userData._id));
            }
        };
        pageLoader();
    }, [user, userProperties, userData]);

    return (
        <div className="myfavorite">
            <div className="fixed-top mt-5" style={{ width: "max-content" }}>
                <button type="button"
                    style={{ border: "none", background: "none" }}
                    onClick={() => window.history.back()}
                >
                    <h6
                        style={{ cursor: "pointer", minWidth: "max-content" }}
                        className="font-weight-light m-2 go-back-link p-2"
                    >
                        <MdArrowBackIos
                            style={{ fontSize: "15px", marginBottom: "3px" }}
                        />{" "}
                        Retour
                    </h6>
                </button>
            </div>
            {userData ? (
                <div className="myfavorite pt-3">
                    <div className="site-section site-section-sm bg-light pt-3">
                        <div className="top-section"></div>
                        <div className="form-group mb-4">
                            <img
                                className="user-profile-page-picture"
                                src={userData.avatar ? userData.avatar : userProfile}
                                alt="user-profile"
                            />
                        </div>
                        <div className="text-dark d-flex flex-column justify-content-center description pt-4">
                            <h6 className="text-center">{userData.username}</h6>
                            <p className="text-center mb-1"> {userData.bio}</p>
                            <p className="text-center mb-1"><ImLocation className="text-danger" /> Soanierana  Antananarivo</p>
                            <p className="text-center mb-1"><ImPhone className="text-success mb-1" /> {userData.phone}</p>
                        </div>
                        <div className="d-flex justify-content-center my-2">
                            <div className="d-flex justify-content-beetween mx-5">
                                <div className="d-flex flex-column justify-content-center text-dark">
                                    <h5 className="text-center text-danger">{userProperties ? userProperties.length : "00"}</h5>
                                    <p className="text-center font-weight-bold">Maison</p>
                                </div>
                                <div className="d-flex flex-column justify-content-center text-dark mx-5">
                                    <h5 className="text-center text-danger">0</h5>
                                    <p className="text-center font-weight-bold">Terrain</p>
                                </div>
                                <div className="d-flex flex-column justify-content-center text-dark">
                                    <h5 className="text-center text-danger">56</h5>
                                    <p className="text-center font-weight-bold">J'aime</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex  justify-content-center mb-4">
                            <div className="d-flex justify-content-beetween mx-5">
                                {user && isLiked ? (
                                    <button style={{ borderRadius: "15px" }} className="profile-btn btn mx-2" type="button" onClick={() => setIsLiked(false)}><BiCheck className="mb-1 text-success" /> J'aime déjà</button>
                                ) : (
                                    <button style={{ borderRadius: "15px" }} className="profile-btn btn mx-2" type="button" onClick={() => {(user) ? setIsLiked(true) : notLogedPopUp()}} ><BiSolidLike className="mb-1" /> J'aime</button>
                                )}

                                <button style={{ borderRadius: "15px" }} className="profile-btn btn mx-2" type="button">Contacter</button>
                            </div>
                        </div>
                        <div className="custom-container" style={{ paddingBottom: "80px", minHeight: "unset !important" }}>
                            {userProperties && userProperties.length === 0 ? (
                                <>
                                    <div className="no-booking d-flex justify-content-center align-items-center mt-5">
                                        <PiSmileySadThin
                                            style={{ fontSize: "100px" }}
                                        />
                                    </div>
                                    <center>
                                        {" "}
                                        <p style={{ fontWeight: "400" }} className="m-2">
                                            Aucune annonce trouvée.
                                        </p>
                                    </center>
                                </>
                            ) : (
                                <div className="row">
                                    {userProperties &&
                                        userProperties.map(
                                            (property) =>
                                                property && (
                                                    <FavoritePropertyDetails
                                                        key={property._id}
                                                        property={property}
                                                    />
                                                )
                                        )}
                                </div>
                            )}
                            {!userProperties && (
                                <div className="row">
                                    {[...Array(6)].map((_, index) => (
                                        <FavoritePropertyDetailsSkeleton key={index} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="loader">
                    chargement...
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;
