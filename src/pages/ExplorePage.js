import PropertyDetails from "../components/PropertyDetails";
import PropertyFilter from "../components/PropertyFilter";
import HomeSlider from "../components/HomeSlider";
import { useSelector } from "react-redux";

const ExplorePage = () => {
  //redux
  const topProperties = useSelector((state) => state.topProperties);

  return (
    <div className="home">
      <HomeSlider />
      <div className="site-section site-section-sm pb-0">
        <div className="container" id="prodisplay">
          <PropertyFilter />
        </div>
      </div>
      <div className="site-section site-section-sm bg-light">
        <div className="custom-container" style={{ paddingBottom: "80px" }}>
          <div className="row">
            {topProperties &&
              topProperties.map(
                (property) =>
                  property.property && (
                    <div className="col-md-6 col-lg-4 mb-4">
                      <PropertyDetails
                        key={property.property._id}
                        property={property.property}
                      />
                    </div>
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;