import { useSelector } from "react-redux";
import TikTokStyleListing from "../components/TikTokStyleListing";

const TranogasyFeed = () => {
  const properties = useSelector((state) => state.properties);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        WebkitOverflowScrolling: "touch", // smoother iOS scroll
        overscrollBehaviorY: "contain", // prevent bouncing scroll
      }}
    >
      {properties && properties.length > 0 && properties.slice(0, 10).map((property, index) => (
        <div
          key={index}
          style={{
            height: "100vh",
            width: "100%",
            scrollSnapAlign: "start",
          }}
        >
          <TikTokStyleListing property={property} />
        </div>
      ))}
    </div>
  );
};

export default TranogasyFeed;