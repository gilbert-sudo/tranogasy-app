import React, { useState,  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HouseSearchForm from "../components/HouseSearchForm";
import FeatureUnderConstruction from "../components/FeatureUnderConstruction";

import { setSearchResults, setPreviousUrl } from "../redux/redux";

const SearchPage = () => {
  const dispatch = useDispatch();
  const pagination = useSelector((state) => state.pagination[0]);
  const searchResults = useSelector((state) => state.searchResults);
  const [selectedOption, setSelectedOption] = useState(false);
  const [oneTimeTask, setOneTimeTask] = useState(null);

  if (oneTimeTask === null) {
    if (!isNaN(pagination.previousUrl)) {
      dispatch(setPreviousUrl(null));
    }
    setOneTimeTask("done");
  }
  
  useEffect(() => {
    function simpleChecking() {
      if (searchResults) {
        dispatch(setSearchResults(null));
      }
    }
    simpleChecking();
  }, [searchResults]);
  return (
    <div className="container mt-5 pb-5 pt-3">
      <div className="bg-white rounded-lg shadow-sm">
        <ul role="tablist" className="nav bg-light nav-pills nav-fill mb-3">
          <li className="nav-item">
            <a
              data-toggle="pill"
              href="#nav-tab-rent"
              style={{ border: "1px solid #7cbd1e",borderRadius: "30px" }}
              className="btn-outline-success nav-link font-weight-bold active"
            >
              <i className="fa fa-credit-card" />
              Maison
            </a>
          </li>
          <li className="nav-item">
            <a
              data-toggle="pill"
              href="#nav-tab-sale"
              style={{ border: "1px solid #7cbd1e",borderRadius: "30px" }}
              className="btn-outline-success nav-link font-weight-bold"
            >
              <i className="fa fa-paypal" />
              Terrain
            </a>
          </li>
          <li className="nav-item">
            <a
              data-toggle="pill"
              href="#nav-tab-land"
              style={{ border: "1px solid #7cbd1e",borderRadius: "30px" }}
              className="btn-outline-success nav-link font-weight-bold"
            >
              <i className="fa fa-university" />
              Utilisateur
            </a>
          </li>
        </ul>
        <div className="tab-content">
          <div id="nav-tab-rent" className="tab-pane fade show active">
            <HouseSearchForm />
          </div>
          <div id="nav-tab-sale" className="tab-pane fade">
            <FeatureUnderConstruction />
          </div>
          <div id="nav-tab-land" className="tab-pane fade">
            <FeatureUnderConstruction />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
