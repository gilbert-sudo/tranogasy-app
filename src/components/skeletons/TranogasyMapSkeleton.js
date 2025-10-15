import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TranogasyMapSkeleton() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "98dvh",
        overflow: "hidden",
      }}
    >
      {/* Full background skeleton (map placeholder) */}
      <Skeleton height="100%" width="100%" />

      {/* === Map Controls Skeleton (top) === */}
      <div
        style={{
          position: "absolute",
          top: "45px",
          left: "10px",
          right: "10px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "8px",
        }}
      >
        {/* Search input skeleton */}
        <Skeleton
          height={50}
          width="100%"
          borderRadius={30}
        />

        {/* Filter button skeleton */}
        <Skeleton width={"35vh"} height={50} borderRadius={30} baseColor="#d9d9d9ff" highlightColor="#f5f5f5"/>

        {/* Optional binoculars / nearby button */}
        <Skeleton circle width={50} height={50} baseColor="#d9d9d9ff" highlightColor="#f5f5f5"/>
      </div>

      {/* Circle in the middle of the map */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Skeleton
          width={163}
          height={155}
          borderRadius={9999}
          baseColor="#d5d4d4ff"
          highlightColor="#f5f5f5"
        />
      </div>

      {/* User location button (bottom-right) */}
      <div style={{ position: "absolute", bottom: "25px", right: "15px" }}>
        <Skeleton circle width={45} height={45} baseColor="#d9d9d9ff" highlightColor="#f5f5f5"/>
      </div>

      {/* Bottom tabs skeleton (Plan / Satellite) */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
        }}
      >
        <Skeleton width={100} height={40} borderRadius={8} baseColor="#d9d9d9ff" highlightColor="#f5f5f5"/>
        <Skeleton width={100} height={40} borderRadius={8} baseColor="#d9d9d9ff" highlightColor="#f5f5f5"/>
      </div>
    </div>
  );
}
