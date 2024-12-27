import OwlCarousel from 'react-owl-carousel';
import './css/owlcarousel.css';

const options = {
  items: 1,
  nav: true,
  dots: true,
  autoplay: false,
  loop: true
};

const MiniCarousel = ({ images }) => {
  // Take only the first 3 images
  const displayedImages = images.slice(0, 3);

  return (
    <OwlCarousel
      style={{ backgroundColor: "#ECEFF4", borderRadius: "15px", height: "16rem", overflow: 'hidden' }}
      className="slide-one-item home-slider owl-theme"
      {...options}
    >
      {displayedImages.map((image, index) => (
        <div key={index} style={{ height: "16rem", overflow: 'hidden' }}>
          <img
            className="img"
            src={image.src}
            alt={String(index + 1)}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "15px" }}
          />
        </div>
      ))}
    </OwlCarousel>
  );
};

export default MiniCarousel;
