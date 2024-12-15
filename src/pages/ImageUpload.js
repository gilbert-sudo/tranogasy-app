
import { useSelector } from "react-redux";
import DownloadContact from "../components/DownloadContact";
import NotLogedIn from "../components/NotLogedIn";


const ImageUpload = () => {
  // redux

  const user = useSelector((state) => state.user);




  return (
    <div className="mylisting">
      {user && user ? (
        <div className="mylisting mt-5 pt-1">
          <div className="site-section site-section-sm bg-light">
            <div className="custom-container" style={{ paddingBottom: "80px" }}>
              <div className="mb-5 d-flex align-items-center justify-content-between mb-3">
                <h6 className="font-weight-light text-uppercase mt-1">
                  Vos annonces :
                </h6>
                <DownloadContact/>
              </div>
              <a href="tel:0345189896"><img src="images\icons\icon-96x96.png" alt="Call phone number" /> appeler mikajy</a>
            </div>
          </div>
        </div>
      ) : (
        <NotLogedIn />
      )}
    </div>
  );
};

export default ImageUpload;
