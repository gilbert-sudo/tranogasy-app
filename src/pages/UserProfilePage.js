import { useRoute } from "wouter";
import FavoritePropertyDetails from "../components/FavoritePropertyDetails";
import { useSelector } from "react-redux";
import { useLoader } from "../hooks/useLoader";
import { useUser } from "../hooks/useUser";
import { useImage } from "../hooks/useImage";
import { useEffect, useState } from "react";

//import css
import "./css/UserProfile.css";

//import user photo profil
import userProfile from "../img/user-avatar.png";

//import icons
import { ImLocation } from "react-icons/im";
import { BiSolidLike } from "react-icons/bi";

const UserProfilePage = () => {
    // redux
    const { getUserById } = useUser();
    const {loadSpesificUsersProperties } = useLoader();
    const likedPropertiesState = useSelector((state) => state.likedProperties);
    const user = useSelector((state) => state.user);

    const [oneTimeTask, setOneTimeTask] = useState(null);
    const { noFavoriteImg } = useImage();

    if (oneTimeTask === null) {
        // scroll to top of the page
        window.scrollTo(0, 0);
        setOneTimeTask("done");
    }

    const [match, params] = useRoute("/userProfile/:userId");
    const userId = match ? params.userId : "";
    const [userData, setUserData] = useState(null);
    const [userProperties, setUserProperties] = useState(null);

    useEffect(() => {
        const pageLoader = async () => {
            if (userId) {
                (userId === user._id) ? setUserData(user) : setUserData(await getUserById(userId));
            }
            if (userData) {
                if (!userProperties) {
                    setUserProperties(await loadSpesificUsersProperties(userData._id));
                }
            }
        };
        pageLoader();
    }, [user, userProperties, userData]);

    return (
        <div className="myfavorite">
            {user && userData ? (
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
                            <p className="text-center mb-1"><ImLocation className="text-danger" /> Soanierana  Antananarivo</p>
                            <p className="text-center mb-1">{userData.phone}</p>
                        </div>
                        <div className="d-flex justify-content-center my-2">
                            <div className="d-flex justify-content-beetween mx-5">
                                <div className="d-flex flex-column justify-content-center text-dark">
                                    <h5 className="text-center text-danger">46</h5>
                                    <p className="text-center font-weight-bold">Annonces</p>
                                </div>
                                <div className="d-flex flex-column justify-content-center text-dark mx-5">
                                    <h5 className="text-center text-danger">118</h5>
                                    <p className="text-center font-weight-bold">Vues</p>
                                </div>
                                <div className="d-flex flex-column justify-content-center text-dark">
                                    <h5 className="text-center text-danger">456</h5>
                                    <p className="text-center font-weight-bold">likes</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex  justify-content-center mb-4">
                            <div className="d-flex justify-content-beetween mx-5">
                                <button style={{ borderRadius: "15px" }} className="profile-btn btn mx-2" type="button"><BiSolidLike className="mb-1" /> J'aime</button>
                                <button style={{ borderRadius: "15px" }} className="profile-btn btn mx-2" type="button">Contacter</button>
                            </div>
                        </div>
                        <div className="custom-container" style={{ paddingBottom: "80px", minHeight: "unset !important" }}>
                            {likedPropertiesState && likedPropertiesState.length === 0 ? (
                                <>
                                    <div className="no-booking d-flex justify-content-center align-items-center">
                                        <img
                                            className="img-fluid"
                                            style={{ maxHeight: "55vh", borderRadius: "15px" }}
                                            src={noFavoriteImg()}
                                            alt="Pas de favoris"
                                        />
                                    </div>
                                    <center>
                                        {" "}
                                        <p style={{ fontWeight: "400" }} className="m-2">
                                            Répertorier les propriétés qui vous intéressent en
                                            cliquant sur l'icône en forme de cœur.
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
