  // Modern Loader Component
  const LoadingOverlay = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          backdropFilter: "blur(5px)",
          borderRadius: "inherit",
        }}
      >
        {/* Animated Logo/Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#7cbd1e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            animation: "pulse 2s infinite ease-in-out",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        {/* Loading Text */}
        <p
          style={{
            fontSize: "1.1rem",
            color: "#333",
            fontWeight: "500",
            marginBottom: "15px",
          }}
        >
          En train de vérifier
        </p>

        {/* Animated Dots */}
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#7cbd1e",
                animation: `bounce 1.4s infinite ease-in-out ${dot * 0.16}s`,
              }}
            />
          ))}
        </div>

        {/* CSS Animations */}
        <style>
          {`
            @keyframes pulse {
              0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(124, 189, 30, 0.4);
              }
              50% {
                transform: scale(1.05);
                box-shadow: 0 0 0 10px rgba(124, 189, 30, 0);
              }
              100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(124, 189, 30, 0);
              }
            }

            @keyframes bounce {
              0%, 80%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
              }
              40% {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}
        </style>
      </div>
    );
  };

  export default LoadingOverlay;