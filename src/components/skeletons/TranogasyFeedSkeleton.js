import React from "react";

const SkeletonBox = ({ width, height, circle = false, style = {} }) => (
    <div
        className="skeleton"
        style={{
            width,
            height,
            borderRadius: circle ? "50%" : "8px",
            background: "linear-gradient(90deg, #222 25%, #333 50%, #222 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            ...style,
        }}
    />
);

const TranogasyFeedSkeleton = () => {
    return (
        <div
            style={{
                width: "100%",
                height: "98vh",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#000",
                color: "#fff",
            }}
        >

            {/* Image area */}
            <SkeletonBox width="100%" height="100%" style={{ borderRadius: 0 }} />

            {/* Mini horizontal gallery */}
            <div
                style={{
                    position: "absolute",
                    top: 75,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 20,
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                    padding: "4px 8px",
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.4)",
                }}
            >
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonBox key={i} width={43} height={43} />
                ))}
            </div>

            {/* Back button */}
            <SkeletonBox
                width={40}
                height={40}
                circle
                style={{
                    position: "absolute",
                    top: 30,
                    left: 5,
                    zIndex: 2000,
                }}
            />

            {/* Date placeholder */}
            <SkeletonBox
                width={80}
                height={20}
                style={{
                    position: "absolute",
                    top: 38,
                    right: 10,
                    borderRadius: 20,
                }}
            />

            {/* Vertical action buttons */}
            <div
                style={{
                    position: "absolute",
                    bottom: 120,
                    right: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    alignItems: "center",
                }}
            >
                <SkeletonBox width={50} height={50} circle />
                <SkeletonBox width={30} height={30} circle />
                <SkeletonBox width={30} height={30} circle />
                <SkeletonBox width={30} height={30} circle />
                <SkeletonBox width={30} height={30} circle />
                <div style={{ position: "relative", pointerEvents: "none", height: 10, width: 30 }}>
                    <SkeletonBox
                        width={100}
                        height={35}
                        borderRadius={30}
                        style={{
                            position: "absolute",
                            transform: "translateX(-70%)",
                        }}
                    />
                </div>
            </div>

            {/* Bottom info section */}
            <div
                style={{
                    position: "absolute",
                    bottom: 80,
                    left: 10,
                    right: 100,
                }}
            >
                <SkeletonBox width={120} height={20} style={{ marginBottom: 10 }} />
                <SkeletonBox width={200} height={15} style={{ marginBottom: 6 }} />
                <SkeletonBox width={100} height={15} style={{ marginBottom: 6 }} />
                <SkeletonBox width="80%" height={40} style={{ marginBottom: 10 }} />
                <SkeletonBox width={140} height={20} />
            </div>
        </div>
    );
};

export default TranogasyFeedSkeleton;

/* Add shimmer animation */
const styles = document.createElement("style");
styles.innerHTML = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, #222 25%, #333 50%, #222 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
`;
document.head.appendChild(styles);
