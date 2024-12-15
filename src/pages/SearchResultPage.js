import React, { useState } from "react";
import PropertyDetails from "../components/PropertyDetails";
import NoResultFound from "../components/NoResultFound";
import SearchLoader from "../components/SearchLoader";
import { useSelector, useDispatch } from "react-redux";
import { setPreviousUrl } from "../redux/redux";
import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import ReactPaginate from "react-paginate";
import "./css/custom.css";
import "./css/pagination.css";

const SearchResultPage = () => {
  //redux
  const dispatch = useDispatch();
  const pagination = useSelector((state) => state.pagination[0]);
  const searchResults = useSelector((state) => state.searchResults);
  const searchForm = useSelector((state) => state.searchForm);

  // Pagination state variables
  const [currentPage, setCurrentPage] = useState(
    pagination.previousUrl ? pagination.previousUrl : 0
  );
  const [oneTimeTask, setOneTimeTask] = useState(null);

  const itemsPerPage = 10; // Number of items to display per page (adjust as needed)

  // Calculate the offset and current items
  const offset = currentPage * itemsPerPage;
  const currentItems = searchResults.slice(offset, offset + itemsPerPage);

  if (oneTimeTask === null) {
    // scroll to top of the page
    window.scrollTo(0, 0);
    setOneTimeTask("done");
  }

  // Handle page change
  const handlePageChange = (data) => {
    dispatch(setPreviousUrl(data.selected));
    setCurrentPage(data.selected);
  };

  return (
    <div className="search-result">
      {searchResults && searchResults.length !== 0 && (
        <>
          <div className="site-section site-section-sm mt-5 pb-0">
            <div className="container" id="prodisplay">
              <div className="row">
                <div className="col-md-12">
                  <div className="view-options bg-white py-2 px-1 align-items-center">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span style={{ fontSize: "0.9rem", fontWeight: "400" }}>
                          Résultats trouvés:{" "}
                          <strong>{searchResults.length}</strong>
                        </span>
                      </div>
                      <div className="select-wrap">
                        <span className="icon icon-arrow_drop_down" />
                        <select className="form-control form-control-sm d-block rounded-0">
                          <option value="">Trier par</option>
                          <option value="">Prix croissant</option>
                          <option value="">Prix décroissant</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Display current items */}
          <div className="site-section site-section-sm bg-light">
            <div className="custom-container" style={{ paddingBottom: "80px" }}>
              <div className="row">
                {currentItems.map((property) => (
                  <div className="col-md-6 col-lg-4 mb-4">
                    <PropertyDetails key={property._id} property={property} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* bottom navbar */}
          <div class="fixed-bottom">
            <center>
              <div className="pagination-bottom-navbar p-1 bg-light">
                {" "}
                {/* Pagination */}
                <ReactPaginate
                  previousLabel={
                    <>
                      <TfiArrowCircleLeft />{" "}
                      <small className="prev-btn-label font-weight-light mb-1">
                        préc
                      </small>
                    </>
                  }
                  nextLabel={
                    <>
                      <small className="next-btn-label font-weight-light mb-1">
                        suiv
                      </small>{" "}
                      <TfiArrowCircleRight />
                    </>
                  }
                  breakLabel={"..."}
                  pageCount={Math.ceil(searchResults.length / itemsPerPage)}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"custom-page-item"}
                  pageLinkClassName={"custom-page-link"}
                  previousClassName={"previous-btn custom-page-item"}
                  previousLinkClassName={"custom-page-link"}
                  nextClassName={"next-btn custom-page-item"}
                  nextLinkClassName={"custom-page-link"}
                  breakClassName={"break-btn custom-page-item"}
                  breakLinkClassName={"custom-page-link"}
                  activeClassName={"active"}
                  initialPage={currentPage}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={1}
                  renderOnZeroPageCount={null}
                />
              </div>
            </center>
          </div>
          {/* bottom navbar */}
        </>
      )}
      {searchResults && searchResults.length === 0 && (
        <NoResultFound searchForm={searchForm}/>
      )}
      {!searchResults && (
        <SearchLoader/>
      )}
    </div>
  );
};

export default SearchResultPage;
