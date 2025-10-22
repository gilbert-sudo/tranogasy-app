import { useState, useRef } from "react";
import { FaUserAlt, FaLink } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";
import imageCompression from "browser-image-compression";
import userProfile from "../img/user-avatar.png";

const ListingsSourcesInput = ({
  sourcesAvatar,
  setSourcesAvatar,
  sourcesUsername,
  setSourcesUsername,
  sourcesLink,
  setSourcesLink,
  required,
}) => {
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleUploading = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setImageIsLoading(true);
    setError("");
    setSourcesAvatar(URL.createObjectURL(selectedFiles[0]));

    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(selectedFiles[0], options);
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

      if (response.ok) {
        setSourcesAvatar(json.imageUrl);
      } else {
        console.error("Erreur lors du téléchargement :", response.statusText);
        setSourcesAvatar(null);
        setError("Échec du téléchargement de l'image. Réessayez.");
      }
    } catch (err) {
      console.error("Erreur :", err);
      setSourcesAvatar(null);
      setError("Échec du téléchargement de l'image.");
    } finally {
      setImageIsLoading(false);
    }
  };

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const handleLinkChange = (e) => {
    const value = e.target.value.trim();
    setSourcesLink(value);

    if (value && !/^https?:\/\/[\w.-]+\.[a-z]{2,}/i.test(value)) {
      setError("Lien invalide. Exemple : https://example.com");
    } else {
      setError("");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        border: "1px solid #ced4da",
        borderRadius: "20px",
        padding: "20px",
        marginTop: "20px",
      }}
    >
      <label
        style={{
          position: "absolute",
          top: "-10px",
          left: "15px",
          background: "#fff",
          padding: "0 6px",
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        Sources de l'annonce
      </label>

      <div className="form-group mb-4" style={{ position: "relative" }}>
        <img
          className="user-profile-picture"
          src={sourcesAvatar || userProfile}
          alt="user-profile"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
            margin: "0 auto",
          }}
        />

        {imageIsLoading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(255,255,255,0.85)",
              padding: "6px 12px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#444",
            }}
          >
            Chargement...
          </div>
        )}

        <div
          className="edit-profile-picture-button"
          onClick={handleImageClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "-3px",
            cursor: "pointer",
            color: "#555",
            fontSize: "14px",
          }}
        >
          <MdAddAPhoto style={{ fontSize: "1.3rem", marginRight: "5px" }} />
          <small className="font-weight-bold">Changer</small>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        id="sourceUploaderInput"
        onChange={handleUploading}
        style={{ display: "none" }}
        required={required}
      />

      {/* Username Input */}
      <div style={{ position: "relative", marginTop: "10px" }}>
        <input
          type="text"
          name="sourcesUsername"
          placeholder="Nom d'utilisateur"
          style={{
            width: "100%",
            border: error ? "1px solid red" : "1px solid #999",
            borderRadius: "16px",
            padding: "12px 40px 12px 15px",
            fontSize: "16px",
            textAlign: sourcesUsername ? "center" : "left",
            transition: "border 0.3s ease",
          }}
          value={sourcesUsername}
          onChange={(e) => setSourcesUsername(e.target.value)}
          required={required}
        />
        <span
          style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#6b7280",
          }}
        >
          <FaUserAlt size={18} />
        </span>
      </div>

      {/* Link Input */}
      <div style={{ position: "relative", marginTop: "10px" }}>
        <input
          type="text"
          name="sourcesLink"
          placeholder="Lien de la source"
          style={{
            width: "100%",
            border: error ? "1px solid red" : "1px solid #999",
            borderRadius: "16px",
            padding: "12px 40px 12px 15px",
            fontSize: "16px",
            transition: "border 0.3s ease",
          }}
          value={sourcesLink}
          onChange={handleLinkChange}
          required={required}
        />
        <span
          style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#6b7280",
          }}
        >
          <FaLink size={18} />
        </span>
      </div>

      {/* Clickable link preview */}
      {sourcesLink && !error && (
        <a
          href={sourcesLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "10px",
            color: "#007bff",
            textDecoration: "underline",
            fontSize: "14px",
          }}
        >
          Ouvrir le lien
        </a>
      )}

      {/* Error message */}
      {error && (
        <p
          style={{
            color: "red",
            fontSize: "13px",
            marginTop: "8px",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default ListingsSourcesInput;
