import { useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { FixedSizeList as List } from "react-window";
import TikTokStyleListing from "../components/TikTokStyleListing";

const ITEM_HEIGHT = window.innerHeight;


const TranogasyFeed = () => {
  const properties = useSelector((state) => state.properties);
  const listRef = useRef();

  // This will lock scroll to one item at a time
  const handleScroll = useCallback(() => {
    if (!listRef.current) return;

    const scrollOffset = listRef.current.state.scrollOffset;
    const itemIndex = Math.round(scrollOffset / ITEM_HEIGHT);
    const newOffset = itemIndex * ITEM_HEIGHT;

    listRef.current.scrollTo({
      top: newOffset,
      behavior: "smooth",
    });
  }, []);

  // Add scroll event listener manually
  useEffect(() => {
    const listOuterRef = listRef.current?.outerRef;
    if (!listOuterRef) return;

    let timeout;
    const onScroll = () => {
      if (timeout) clearTimeout(timeout);
      // debounce to wait for scroll end
      timeout = setTimeout(handleScroll, 100);
    };

    listOuterRef.addEventListener("scroll", onScroll);

    return () => listOuterRef.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  const Row = ({ index, style }) => (
    <div style={{ ...style, scrollSnapAlign: "start", backgroundColor: "#000000" }}>
      <TikTokStyleListing property={properties[index]} />
    </div>
  );

  return (
    <List
      height={ITEM_HEIGHT}
      itemCount={properties.length}
      itemSize={ITEM_HEIGHT}
      width={"100%"}
      ref={listRef}
      outerRef={useRef(null)}
      overscanCount={2}
      overflow="hidden"
      layout="vertical"
      style={{
        scrollSnapType: "y mandatory",
        overflowY: "scroll",
      }}
    >
      {Row}
    </List>
  );
};

export default TranogasyFeed;
