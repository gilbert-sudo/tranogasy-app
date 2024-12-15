const SearchLoader = ({ searchForm }) => {
  return (
    <div className="m-3 pt-4">
      <div className="no-booking d-flex justify-content-center align-items-center">
        <img
          src="images/searching.gif"
          style={{ maxHeight: "45vh" }}
          alt="Pas de connexion Internet"
          className="img-fluid"
        />
      </div>
      <center>
        {" "}
        <p style={{ fontWeight: "400", maxWidth: "100vh" }} className="m-2">
          Nous sommes en train de chercher une correspondance et nous vous
          prions de bien vouloir patienter.
        </p>
      </center>
    </div>
  );
};

export default SearchLoader;
