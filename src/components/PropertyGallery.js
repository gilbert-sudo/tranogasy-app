import React from "react";
import "magnific-popup/dist/magnific-popup.css"; // import the Magnific Popup CSS
import $ from "jquery";
import "magnific-popup/dist/jquery.magnific-popup.min.js"; // import the Magnific Popup JS

const PropertyGallery = ({ images }) => {
  React.useEffect(() => {
    // initialize the Magnific Popup
    $(".image-popup").magnificPopup({
      type: "image",
      gallery: {
        enabled: true,
      },
    });
  }, []);

  return (
    <div className="bg-white property-body border-bottom border-left border-right p-0">
      <div className="row no-gutters">
        {images &&
          images.map((img, index) => (
            <div className="border border-light col-sm-6 col-md-4 col-lg-3">
              <a href={img} className="image-popup gal-item">
                <center>
                  <img src={img} alt={index} className="img-fluid" />
                </center>
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PropertyGallery;
