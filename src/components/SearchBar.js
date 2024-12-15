import { BsSearch } from "react-icons/bs";

const SearchBar = () => {
  return (
      <nav style={{boxShadow: "5px 5px 5px -1px #D8D9DA", borderRadius:"15px"}} className="navbar fixed-top navbar-light bg-light pb-0 pt-1 justify-content-between">
        <a className="navbar-brand font-weight-bold" href="#">
          <img
            src="images/logo.png"
            width={30}
            height={30}
            className="d-inline-block align-top"
            alt=""
          />
          <small>
            <trano style={{ color: "#7cbd1e" }}>Trano</trano>
            <gasy style={{ color: "#ec1c24" }}>Gasy</gasy>
          </small>
          .
        </a>
        <h5 className="font-weight-bold"><BsSearch/></h5>
      </nav>
  );
};

export default SearchBar;
