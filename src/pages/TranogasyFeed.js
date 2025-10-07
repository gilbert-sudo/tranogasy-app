import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Virtual, Mousewheel, Keyboard, FreeMode } from 'swiper/modules';
import TranogasyFeedSkeleton from "../components/skeletons/TranogasyFeedSkeleton";
import TikTokStyleListing from "../components/TikTokStyleListing";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/virtual';
import 'swiper/css/mousewheel';
import 'swiper/css/keyboard';
import 'swiper/css/free-mode';

const TranogasyFeed = () => {
  const properties = useSelector((state) => state.properties);
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(false);

  // Handle slide change
  const handleSlideChange = (swiper) => {
    setCurrentIndex(swiper.activeIndex);
  };

  // Programmatic slide control
  const goToSlide = (index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  // Lock/unlock swiper
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      
      if (scrollLocked) {
        swiper.mousewheel.disable();
        swiper.keyboard.disable();
        swiper.allowTouchMove = false;
      } else {
        swiper.mousewheel.enable();
        swiper.keyboard.enable();
        swiper.allowTouchMove = true;
      }
    }
  }, [scrollLocked]);

  return properties ? (
    <div style={{ 
      height: '100vh', 
      backgroundColor: '#000',
      overflow: 'hidden'
    }}>
      <Swiper
        ref={swiperRef}
        direction="vertical"
        slidesPerView={1}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true,
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        freeMode={{
          enabled: false,
          sticky: false,
        }}
        speed={400}
        resistance={true}
        resistanceRatio={0.85}
        longSwipesRatio={0.1}
        followFinger={true}
        threshold={15}
        virtual={{
          enabled: true,
          addSlidesAfter: 1,
          addSlidesBefore: 1,
        }}
        modules={[Virtual, Mousewheel, Keyboard, FreeMode]}
        style={{
          height: '100%',
          touchAction: 'pan-y',
        }}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => {
          // Optional: Initialize at specific slide
          if (currentIndex > 0) {
            swiper.slideTo(currentIndex, 0);
          }
        }}
      >
        {properties.map((property, index) => (
          <SwiperSlide
            key={property.id || index}
            virtualIndex={index}
            style={{
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#000',
            }}
          >
            <TikTokStyleListing
              property={property}
              lockScroll={() => setScrollLocked(true)}
              unlockScroll={() => setScrollLocked(false)}
              isActive={currentIndex === index}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  ) : (
    <TranogasyFeedSkeleton />
  );
};

export default TranogasyFeed;