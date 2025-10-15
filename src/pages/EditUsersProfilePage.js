import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import imageCompression from "browser-image-compression";
import "./css/editusersprofile.css";
import { MdAddAPhoto, MdArrowBackIos } from "react-icons/md";
import { FaEye, FaEyeSlash, FaRegSave } from "react-icons/fa";

import { useUser } from "../hooks/useUser";
import { usePhoto } from "../hooks/usePhoto";
import useInputValidation from "../hooks/useInputValidation";

//import user photo profil
import userProfile from "../img/user-avatar.png";

const EditUsersProfilePage = () => {
  const { updateUser } = useUser();
  const { deleteImg } = usePhoto();
  const { errorMessages, validate, renderError } = useInputValidation();
  //redux
  const user = useSelector((state) => state.user);
  console.log(user);

  const [avatar, setAvatar] = useState(user?.avatar);
  const [oldAvatar, setOldAvatar] = useState(null);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio ? user.bio : null);
  const [phone, setPhone] = useState(user.phone);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [saveBtn, setSaveBtn] = useState(false);

  const handleImageClick = () => {
    // Trigger the click event of the IKUpload component using the ref
    // Trigger the file input inside the IKUpload component
    const input = document.getElementById("uploaderInput");
    if (input) {
      input.click();
    }
  };

  const onUsernameChange = (e) => {
    const newValue = e.target.value;
    setUsername(newValue);

    // Validate username
    validate("username", newValue);
  };

  const onBioChange = (e) => {
    const newValue = e.target.value;
    setBio(newValue);

    // Validate username
    validate("bio", newValue);
  };

  const onPhoneChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setPhone(numericValue);

    // Validate phone number
    validate("phone", numericValue);
  };

  const handleUploading = async (e) => {
    setImageIsLoading(true);

    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length <= 0) {
      setImageIsLoading(false);
      return;
    }
    setAvatar(URL.createObjectURL(selectedFiles[0]));

    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      };

      if (selectedFiles[0]) {
        const compressedFile = await imageCompression(
          selectedFiles[0],
          options
        );

        const formData = new FormData();
        formData.append("file", compressedFile);

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/images/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const json = await response.json();

        if (oldAvatar && oldAvatar.startsWith("http") && oldAvatar !== user?.avatar) {
          deleteImg(oldAvatar);
          console.log("deleted the old uploaded photo", oldAvatar);
        }

        if (response.ok) {
          setAvatar(json.imageUrl);
          setOldAvatar(json.imageUrl);
          console.log(json.imageUrl);
          setImageIsLoading(false);
        } else {
          console.error("Error uploading file:", response.statusText);
          setImageIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setImageIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {
      userId: user._id,
      avatar,
      username,
      bio,
      phone,
      oldPassword,
      newPassword,
    };
    console.log(params);
    updateUser(params);
    console.log("form submitted.");
  };

  // Render the main content

  useEffect(() => {
    async function checkUpdate() {
      avatar !== user?.avatar ||
        username !== user.username ||
        (user.bio ? bio !== user.bio : bio !== "") ||
        (newPassword && newPassword.length > 0) ||
        phone !== user.phone
        ? setSaveBtn(false)
        : setSaveBtn(true);
    }
    checkUpdate();
  }, [avatar, user, username, bio, phone, oldPassword, newPassword]);

  return (
    <form method="post" onSubmit={handleSubmit}>
      <div className="container d-flex justify-content-center">
        <div className="edit-user-card card px-4 py-2">
          <div className="form-group mb-4">
            <img
              className="user-profile-picture"
              src={avatar ? avatar : userProfile}
              alt="user-profile"
            />
            <div
              className="edit-profile-picture-button"
              onClick={handleImageClick}
            >
              <MdAddAPhoto style={{ fontSize: "1.3rem" }} />{" "}
              <small className="font-weight-bold">Changer</small>
            </div>
          </div>
          <div className="form-group">
            <input
              type="file"
              accept="image/*"
              id="uploaderInput"
              onChange={handleUploading}
              style={{ display: "none" }}
            />
          </div>
          <div className="form-group">
            <label
              data-toggle="tooltip"
              title=""
              data-original-title="Le nom que vous voulez laisser apparaitre"
            >
              <strong className="font-weight-bold">Nom d'utilisateur</strong>
              <i className="fa fa-question-circle" />
            </label>
            <input
              type="text"
              maxLength={50}
              required="ON"
              className="form-control"
              value={username}
              onChange={onUsernameChange}
            />
            {renderError("username")}
          </div>
          <div className="form-group">
            <label
              data-toggle="tooltip"
              title=""
            >
              <strong className="font-weight-bold">Bio</strong>
              <i className="fa fa-question-circle" />
            </label>
            <textarea
              className="form-control"
              maxLength={500}
              rows="4"
              placeholder="Descrivez-vous..."
              value={bio}
              onChange={onBioChange}
            ></textarea>
            {renderError("bio")}
          </div>
          <div className="form-group">
            <label
              data-toggle="tooltip"
              title=""
              data-original-title="3 digits code on back side of the card"
            >
              <strong className="font-weight-bold">Numéro de téléphone</strong>
              <i className="fa fa-question-circle" />
            </label>
            <input
              type="tel" // Use type="tel" to display numeric keyboard on mobile devices
              maxLength={10} // Set maxLength to 10 to limit input to 10 characters
              pattern="[0-9]*" // Allow only numeric characters
              required
              className="form-control"
              value={phone}
              onChange={onPhoneChange}
            />
            {renderError("phone")}
          </div>
          <div className="form-group">
            <label
              data-toggle="tooltip"
              title=""
              data-original-title="3 digits code on back side of the card"
            >
              <strong className="font-weight-bold">
                Votre mot de passe actuel
              </strong>
              <i className="fa fa-question-circle" />
            </label>
            <div className="d-flex position-relative">
              <input
                type={showPassword ? "text" : "password"}
                required={newPassword && newPassword.length > 0}
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="btn bg-white show-password-icon"
              >
                <span className="far">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label
              data-toggle="tooltip"
              title=""
              data-original-title="3 digits code on back side of the card"
            >
              <strong className="font-weight-bold">
                Un nouveau mot de passe
              </strong>
              <i className="fa fa-question-circle" />
            </label>
            <div className="d-flex position-relative">
              <input
                type={showPassword ? "text" : "password"}
                required={oldPassword && oldPassword.length > 0}
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="btn bg-white show-password-icon"
              >
                <span className="far">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* bottom navbar */}

      <div class="fixed-bottom bg-white">
        <nav className="d-flex justify-content-between navbar navbar-expand-lg navbar-light">
          <button
            onClick={() => {
              if (oldAvatar && oldAvatar.startsWith("http") && oldAvatar !== user?.avatar) {
                deleteImg(oldAvatar);
                console.log("deleted the old uploaded photo", oldAvatar);
              }
              window.history.back();
            }}
            type="button"
            style={{ fontSize: "15px" }}
            className="text-capitalize font-weight-light btn btn-outline-dark border-0"
          >
            <MdArrowBackIos style={{ fontSize: "15px", marginBottom: "3px" }} />
            Retour
          </button>

          <button
            className="btn btn-success text-white font-weight-bold my-2 my-sm-0"
            style={{ padding: "1.5vh", borderRadius: "10px" }}
            type="submit"
            disabled={
              saveBtn ||
              Object.values(errorMessages).some((message) => message !== "") || 
              imageIsLoading
            }
          >

            {imageIsLoading
              ? "En attente des images ..."
              :
              <>
                <FaRegSave className="mr-2 mb-1" />
                Sauvegarder
              </>
            }
          </button>
        </nav>
      </div>

      {/* bottom navbar */}
    </form>
  );
};

export default EditUsersProfilePage;
