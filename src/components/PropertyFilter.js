import { MdArrowDropDown } from "react-icons/md";

const PropertyFilter = () => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="view-options bg-white py-2 px-1">
          <div className="ml-auto d-flex justify-content-between align-items-center">
            <div>
              <a href="#" className="view-list px-3 border-right">
                Location
              </a>
              <a href="#" className="view-list px-3">
                Vente
              </a>
            </div>
            <div className="select-wrap">
              <MdArrowDropDown className="icon" />
              <select className="form-control form-control-sm d-block" style={{ borderRadius: "30px" }}>
                <option value="">Trier par</option>
                <option value="">Prix croissant</option>
                <option value="">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;
