import { useSelector } from "react-redux";
import { FixedSizeList as List } from "react-window"; // Import FixedSizeList
import TikTokStyleListing from "../components/TikTokStyleListing";

// Component to render individual rows in the virtualized list
// It receives 'index' and 'style' props from react-window
const Row = ({ index, style, data }) => {
  const property = data[index]; // 'data' is the 'itemData' prop passed to the List
  return (
    <div
      style={{
        ...style, // Apply the style provided by react-window for positioning
        height: "100vh", // Your item height (or let react-window manage it fully)
        width: "100%",
        scrollSnapAlign: "start", // Keep your scroll-snap behavior
      }}
    >
      <TikTokStyleListing property={property} />
    </div>
  );
};

const TranogasyFeed = () => {
  const allProperties = useSelector((state) => state.properties);

  // Define the height of each item (100vh, converted to pixels)
  // You might need a more robust way to get this, e.g., using useRef for the container height
  const itemHeight = window.innerHeight; // Assuming 100vh means viewport height

  return (
    <List
      height={window.innerHeight} // Height of the scrollable viewport (e.g., 100vh)
      itemCount={allProperties.length} // Total number of items in your list
      itemSize={itemHeight} // Height of each individual item (100vh)
      width={"100%"} // Width of the list container
      itemData={allProperties} // Pass your entire properties array as itemData
      overscanCount={2} // Render a few extra items above/below the viewport for smoother scrolling
      style={{
        scrollSnapType: "y mandatory",
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorY: "contain",
      }}
    >
      {Row}
    </List>
  );
};

export default TranogasyFeed;