import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { useDispatch, useSelector } from "react-redux";
import {
  setImg,
  reduxAddImg,
  reduxDeleteImg,
  setImgPreview,
  reduxAddImgPreview,
  reduxPopImgPreview,
  reduxDeleteImgPreviewByIndex,
} from "../redux/redux";
import { usePhoto } from "../hooks/usePhoto";
import { MutatingDots } from "react-loader-spinner";
import { TiDelete } from "react-icons/ti";
import "./css/createlisting.css";

const ImageUploader = ({ payload, setImageIsLoading }) => {
  const dispatch = useDispatch();
  const { deleteImg } = usePhoto();
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [oldPropertyLoading, setOldPropertyLoading] = useState(null);

  // image states
  const imgState = useSelector((state) => state.img);
  const imgPreviewState = useSelector((state) => state.imgPreview);
  const [imgCounter, setImgCounter] = useState(imgPreviewState.length);

  // payload && console.log(payload);

  if (payload && oldPropertyLoading === null) {
    console.log("run just onre time");
    setImgCounter(payload.length);
    payload && dispatch(setImg(payload));
    payload && dispatch(setImgPreview(payload));
    setOldPropertyLoading("done");
  }

  const handleUploading = async (e) => {
    const selectedFiles = e.target.files;
    const maxFileNumbers = 8 - imgState.length;

    if (!selectedFiles || selectedFiles.length <= 0) {
      // No file selected
      setIsUploading(false);
      return;
    }
    const looplimit = (selectedFiles.length >= maxFileNumbers) ? maxFileNumbers : selectedFiles.length;

    if (selectedFiles && selectedFiles.length > 0) {
      for (let i = 0; i < looplimit; i++) {
        dispatch(
          reduxAddImgPreview({ src: URL.createObjectURL(selectedFiles[i]) })
        );
        setImgCounter(imgCounter + 1);
      }
      setIsUploading(true);
      setImageIsLoading(true);
      if (selectedFiles.length > maxFileNumbers) {
        alert(`Seuls ${maxFileNumbers} fichiers seront ajoutés à votre annonce.`);
      }
    }

    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1720,
        useWebWorker: true,
      };

      for (let i = 0; i < looplimit; i++) {
        setImageIsLoading(true);
        const compressedFile = await imageCompression(
          selectedFiles[i],
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

        if (response.ok) {
          dispatch(
            reduxAddImg({
              src: json.imageUrl,
              width: json.width,
              height: json.height,
            })
          );
          setImgCounter(imgCounter + 1);
          setImageIsLoading(false);
        } else {
          console.error("Error uploading file:", response.statusText);
          dispatch(reduxPopImgPreview());
          setImgCounter(imgCounter - 1);
          setUploadError(response.statusText);
          setIsUploading(false);
          setImageIsLoading(false);
        }
      }
      setTimeout(() => {
        setIsUploading(false);
        setImageIsLoading(false);
        console.log(imgCounter);
      }, 0);
    } catch (error) {
      console.error("Error uploading file:", error);
      dispatch(reduxPopImgPreview());
      setImgCounter(imgCounter - 1);
      setUploadError(error);
      setIsUploading(false);
      setImageIsLoading(false);
    }
  };

  const handleImageClick = () => {
    // Trigger the click event of the IKUpload component using the ref
    // Trigger the file input inside the IKUpload component
    const input = document.getElementById("uploaderInput");
    if (input) {
      input.click();
      setUploadError(null);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    console.log("handleDeleteImage", imageUrl);
    if (payload) {
      if (!payload.filter((photo) => photo.src === imageUrl.src).length) {
        deleteImg(imageUrl.src);
      }
    } else {
      deleteImg(imageUrl.src);
    }

    dispatch(reduxDeleteImg({ imageUrl: imageUrl.src }));

    setImgCounter(imgCounter - 1);
  };

  const GeneratingImgContainer = ({ imageUrl, index }) => {
    return (
      <div className="col-sm-6 col-md-4 col-lg-3 mb-1">
        <div className="image-container-custom">
          <img src={imageUrl.src} alt="Image" className="img-fluid" />
          {imgState[index] ? (
            <button
              className="delete-button"
              onClick={(e) => {
                e.preventDefault();
                console.log("deleting img", imgState[index]);
                handleDeleteImage(imgState[index]);
                dispatch(reduxDeleteImgPreviewByIndex(index));
              }}
            >
              <TiDelete className="h4 mt-1" />
              <strong>Effacer</strong>
            </button>
          ) : (
            <MutatingDots
              visible={true}
              height="100"
              width="100"
              color="#4fa94d"
              secondaryColor="red"
              radius="10"
              ariaLabel="mutating-dots-loading"
              wrapperStyle={{}}
              wrapperClass="delete-button-loader"
            />
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    console.log(imgState);
  }, [imgState]);

  return (
    <>
      <div className="bg-white property-body border-bottom border-left border-right p-0">
        <div className="row no-gutters">
          {imgPreviewState &&
            imgPreviewState.map((imageUrl, index) => (
              <GeneratingImgContainer
                key={index}
                index={index}
                imageUrl={imageUrl}
              />
            ))}
        </div>
      </div>

      {/* ///////////////////////////////////////////////////////////////// */}
      <div className="col-12 col-sm-6 col-md-4">
        {!isUploading && imgState.length < 8 && (
          <img
            style={{ borderRadius: "15px", cursor: "pointer" }}
            src="images/add-more.jpg"
            className="w-100 mt-3 img-fluid border border-dark"
            alt="ajouter un photo"
            onClick={handleImageClick}
          />
        )}

        <div className="form-group">
          <input
            type="file"
            accept="image/*"
            id="uploaderInput"
            onChange={handleUploading}
            style={{ display: "none" }}
            multiple
          />
        </div>
        {uploadError && uploadError.message === "File type not supported." && (
          <div className="alert alert-danger mt-1" role="alert">
            <small>
              Veuillez sélectionner un fichier image valide (png, jpg, jpeg).
            </small>
          </div>
        )}
        {uploadError && uploadError.message !== "File type not supported." && (
          <div className="alert alert-danger mt-1" role="alert">
            <small>
              Erreur lors de l'envoi de l'image: {uploadError.message}
            </small>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageUploader;
