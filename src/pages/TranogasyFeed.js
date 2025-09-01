import { useRef, useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { FixedSizeList as List } from "react-window";
import TikTokStyleListing from "../components/TikTokStyleListing";

// Detect iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const TranogasyFeed = () => {
  const properties = useSelector((state) => state.properties);
  const listRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const ITEM_HEIGHT = window.innerHeight;
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);
  const momentumTimeout = useRef(null);

  // iOS-specific touch handlers
  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isIOS) return;

    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY.current;

    // Prevent native scroll during momentum scrolling
    if (Math.abs(deltaY) > 10 && isScrolling.current) {
      e.preventDefault();
    }
  }, []);

  // Handle scroll end with momentum detection (iOS specific)
  const handleScrollEnd = useCallback(() => {
    if (!listRef.current) return;

    clearTimeout(momentumTimeout.current);
    momentumTimeout.current = setTimeout(() => {
      isScrolling.current = false;
      const scrollOffset = listRef.current.state.scrollOffset;
      const newIndex = Math.round(scrollOffset / ITEM_HEIGHT);

      if (newIndex !== currentIndex) {
        listRef.current.scrollToItem(newIndex, "smooth");
        setCurrentIndex(newIndex);
      }
    }, isIOS ? 200 : 100); // Longer timeout for iOS momentum
  }, [currentIndex, ITEM_HEIGHT]);

  // Set up scroll event listeners
  useEffect(() => {
    const listElement = listRef.current?.outerRef;
    if (!listElement) return;

    // iOS-specific event listeners
    if (isIOS) {
      listElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      listElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    const handleScroll = () => {
      if (!isScrolling.current) {
        isScrolling.current = true;
        handleScrollEnd();
      }
      clearTimeout(momentumTimeout.current);
      momentumTimeout.current = setTimeout(handleScrollEnd, 100);
    };

    listElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(momentumTimeout.current);
      listElement.removeEventListener('scroll', handleScroll);
      if (isIOS) {
        listElement.removeEventListener('touchstart', handleTouchStart);
        listElement.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [handleScrollEnd, handleTouchMove, handleTouchStart]);

  const Row = useCallback(({ index, style }) => (
    <div
      style={{
        ...style,
        scrollSnapAlign: "start",
        backgroundColor: "#000000",
        WebkitTransform: "translate3d(0,0,0)" // iOS hardware acceleration
      }}
    >
      <TikTokStyleListing property={properties[index]} active={index === currentIndex}/>
    </div>
  ), [properties]);

  return (
    properties &&
    <List
      height={ITEM_HEIGHT}
      itemCount={properties.length}
      itemSize={ITEM_HEIGHT}
      width="100%"
      ref={listRef}
      overscanCount={1}
      initialScrollOffset={currentIndex * ITEM_HEIGHT}
      style={{
        WebkitOverflowScrolling: "touch",
        scrollSnapType: "y mandatory",
        overflowY: "auto",
        transform: "translate3d(0,0,0)", // iOS performance boost
      }}
      outerElementType={isIOS ? "div" : undefined} // Custom outer element for iOS
    >
      {Row}
    </List>
  );
};

export default TranogasyFeed;