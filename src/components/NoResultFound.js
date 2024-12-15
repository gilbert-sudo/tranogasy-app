import { usePopup } from "../hooks/usePopup";

import { FaBell } from "react-icons/fa6";
import { BsSearch } from "react-icons/bs";

const NoResultFound = ({searchForm}) => {

    const { featureUnderConstructionPopup } = usePopup();

  return (
    <div className="m-3 pt-4">
      <div className="no-booking d-flex justify-content-center align-items-center">
        <img
          src="images/no-search-result.jpg"
          style={{ maxHeight: "45vh" }}
          alt="Pas de connexion Internet"
          className="img-fluid"
        />
      </div>
      <center>
        {" "}
        {searchForm.byNumber ? (
          <p style={{ fontWeight: "400", maxWidth: "100vh" }} className="m-2">
            Le numéro <strong>{searchForm.propertyNumber}</strong> ne correspond
            à aucune propriété.
          </p>
        ) : (
          <p style={{ fontWeight: "400", maxWidth: "100vh" }} className="m-2">
            Nous sommes désolés, mais nous n'avons trouvé aucune propriété
            correspondant à vos critères de recherche. Veuillez essayer une
            autre recherche avec des critères différents ou élargir votre
            budget. Nous sommes là pour vous aider dans votre recherche.
          </p>
        )}
        <br />
        <button
          type="button"
          style={{ borderRadius: "30px" }}
          className="btn btn-success"
          onClick={() => {
            searchForm.byNumber
              ? window.history.back()
              : featureUnderConstructionPopup();
          }}
        >
          <i className="refresh-icon fas fa-sync-alt">
            {searchForm.byNumber ? (
              <BsSearch className="mb-1" />
            ) : (
              <FaBell className="mb-1" />
            )}
          </i>{" "}
          {searchForm.byNumber ? `retourner` : `Préviens-moi dès qu'il y aura`}
        </button>
      </center>
    </div>
  );
};

export default NoResultFound;
