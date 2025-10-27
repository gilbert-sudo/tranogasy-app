import { usePopup } from "../hooks/usePopup";
import { MdArrowDropDown } from "react-icons/md";

const PropertyFilter = () => {

  const { featureUnderConstructionPopup } = usePopup();

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="view-options bg-white py-2 px-1">
          <div className="ml-auto d-flex justify-content-between align-items-center">
            <div>
              <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="view-list px-3 border-right"
              style={{
                fontWeight: "bold"
              }}
              >
                Location
              </a>
              <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                featureUnderConstructionPopup();
              }}
              className="view-list px-3"
              >
                Vente
              </a>
            </div>
            <div className="select-wrap">
              <MdArrowDropDown className="icon" />
              <select className="form-control form-control-sm d-block" style={{ borderRadius: "30px", width: "100px" }}>
                <option value="">Trier par</option>
                <option value="">Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;
