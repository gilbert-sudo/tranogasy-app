import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import PropertyDetails from "../components/PropertyDetails";
import PropertyFilter from "../components/PropertyFilter";
import ListingDetailsSkeleton from "../components/skeletons/ListingDetailsSkeleton";
import HomeSlider from "../components/HomeSlider";

import PropertyDetailsPage from "./PropertyDetailsPage";

import { useImage } from "../hooks/useImage";
import { useLike } from "../hooks/useLike";
import { useLogin } from "../hooks/useLogin";
import useSound from "use-sound";

import { useSelector, useDispatch } from "react-redux";
import { setGilbertAiField } from "../redux/redux";
import { FixedSizeGrid as Grid } from "react-window";
import Typewriter from "typewriter-effect";
import GraphemeSplitter from "grapheme-splitter";

import { Settings, SendHorizontal, MapPin, Heart } from "lucide-react";
import {
  FaBed,
  FaCouch,
  FaUtensils,
  FaToilet,
  FaShower,
} from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

const stringSplitter = (str) => {
  const splitter = new GraphemeSplitter();
  return splitter.splitGraphemes(str);
};

function countWords(str) {
  if (str === null || str.trim() === "") {
    return 0; // Handle null or empty strings
  }
  const trimmedStr = str.trim();
  const words = trimmedStr.split(/\s+/);
  return words.length;
}

function getRandomIntInclusive(min, max) {
  // Ensure min and max are treated as integers for the calculation
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}


const typeDelay = 25; //this is in ms

const ExplorePage = () => {
  const topProperties = useSelector((state) => state.topProperties);
  const gilbertAi = useSelector((state) => state.gilbertAi);
  const user = useSelector((state) => state.user);

  const [, setLocation] = useLocation();
  const gridContainerRef = useRef();
  const dispatch = useDispatch();
  const gridRef = useRef();
  const chatboxRef = useRef();
  const messagesEndRef = useRef();
  const messagesContainerRef = useRef();
  const { gilbertIALogoDark, gilbertIALogoLight } = useImage();
  const { like, disLike } = useLike();
  const { notLogedPopUp } = useLogin();
  const [play] = useSound("sounds/Like Sound Effect.mp3");

  const [gridWidth, setGridWidth] = useState(0);
  const [columnCount, setColumnCount] = useState(3);
  const [atTheTop, setAtTheTop] = useState(true);
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSliderVisible, setIsSlideVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [chatMessages, setChatMessages] = useState(gilbertAi.chatMessages);
  useEffect(() => {
    dispatch(setGilbertAiField({ key: "chatMessages", value: chatMessages }));
  }, [chatMessages]);

  // Track previous message count to detect new messages
  const previousMessageCountRef = useRef(chatMessages.length);

  // Auto-scroll to bottom
  useEffect(() => {

    let interval;

    if (chatMessages.length > previousMessageCountRef.current) {
      scrollToBottom("smooth");
    }
    previousMessageCountRef.current = chatMessages.length;

    if (isTyping) {
      interval = setInterval(() => {
        scrollToBottom("smooth");
      }, 500);
    }

    return () => {
      // cleanup when isTyping becomes false or component unmounts
      clearInterval(interval);
    };
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (isChatboxOpen) {
      scrollToBottom("instant");
    }
  }, [isChatboxOpen]);

  const scrollToBottom = (mode) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: mode,
      });
    }
  };

  const handleCloseSlideClick = () => {
    setIsSlideVisible(false);
  };


  // prevent scroll on body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close chatbox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isTyping) return
      if (
        chatboxRef.current &&
        !chatboxRef.current.contains(event.target) &&
        !event.target.closest(".gibert-ai-btn")
      ) {
        setIsChatboxOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // responsive columns
  useEffect(() => {
    const updateGridMetrics = () => {
      if (gridContainerRef.current) {
        const newWidth = gridContainerRef.current.offsetWidth;
        setGridWidth(newWidth);
        if (newWidth < 480) setColumnCount(1);
        else if (newWidth < 768) setColumnCount(2);
        else setColumnCount(3);
      }
    };
    updateGridMetrics();
    window.addEventListener("resize", updateGridMetrics);
    return () => window.removeEventListener("resize", updateGridMetrics);
  }, [topProperties]);

  const toggleChatbox = () => {
    if (isTyping) return
    setIsChatboxOpen(!isChatboxOpen);
  };

  // Function to render different message types
  const renderMessageContent = (msg) => {

    if (msg.type === 'property') {
      return (
        <div style={{
          maxWidth: "100%",
          border: "1px solid #e1e5e9",
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "white",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          margin: "4px 0"
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
          }}
          onClick={() => handlePropertyClick(msg.property)}
        >
          {/* Property Image */}
          <div style={{
            position: "relative",
            height: "150px",
            background: msg.property.images ? `url(${msg.property.images[0].src})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "9px"
          }}>
            {/* Badge - New Today */}
            <div style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "10px",
              fontWeight: "bold",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(16, 185, 129, 0.95)"
            }}>
              🆕 Aujourd'hui
            </div>

            {/* Favorite Button */}
            <div style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              paddingTop: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              color: msg.liked ? "red" : "black"
            }}
              onClick={(e) => {
                e.stopPropagation();
                handleFavoriteClick(msg);
              }}>
              <Heart />
            </div>
          </div>

          {/* Property Details */}
          <div style={{ padding: "10px", position: "relative" }}>
            {/* Price */}
            <div style={{
              position: "absolute",
              top: -35,
              right: "10px",
              fontSize: "12px",
              padding: "5px 10px",
              borderRadius: "9999px",
              backgroundColor: "white",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "6px",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}>
              <span style={{
                background: "linear-gradient(135deg, #7cbd1e, #1d4ed8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                {msg.property.rent && msg.property.rent.toLocaleString("en-US")} Ar/mois
              </span>
            </div>

            {/* Title */}
            <div style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "5px",
              lineHeight: "1.3",
              display: "flex",
              alignItems: "flex-start",
            }}>
              <span className="mr-1" style={{ fontSize: "14px", marginTop: "1px", color: "red" }}>#</span>
              {msg.property.title}
            </div>

            {/* Location */}
            <div style={{
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "5px",
              display: "flex",
              alignItems: "center",
              gap: "2px"
            }}>
              <MapPin size={12} color="red" className="mb-1" />
              <small>{msg.property.city.fokontany} {msg.property.city.commune}</small>
            </div>

            {/* Features */}
            <div style={{
              display: "flex",
              gap: "12px",
              marginBottom: "5px",
              padding: "0 5px",
              borderBottom: "1px solid #f3f4f6"
            }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  fontSize: "11px",
                  color: "#6b7280"
                }}>
                <span>{msg.property.livingRoom}</span>
                <span><FaCouch style={{ marginBottom: "2px" }} /></span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  fontSize: "11px",
                  color: "#6b7280"
                }}>
                <span>{msg.property.rooms}</span>
                <span><FaBed style={{ marginBottom: "2px" }} /></span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  fontSize: "11px",
                  color: "#6b7280"
                }}>
                <span>{msg.property.kitchen}</span>
                <span> <FaUtensils style={{ marginBottom: "4px" }} /></span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  fontSize: "11px",
                  color: "#6b7280"
                }}>
                <span>{msg.property.bathrooms}</span>
                <span> <FaShower style={{ marginBottom: "3px" }} /></span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  fontSize: "11px",
                  color: "#6b7280"
                }}>
                <span>{msg.property.toilet}</span>
                <span> <FaToilet className="mb-1" /></span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  fontSize: "11px",
                  color: "#6b7280",
                }}>
                <span>{msg.property?.area} </span>
                <span style={{ fontWeight: "1000" }}> m²</span>
              </div>
            </div>

            {/* Footer with Date and Action */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              {/* View Details Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePropertyClick(msg.property);
                }}
                style={{
                  width: "100%",
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  color: "#7cbd1e",
                  border: "1.5px solid #7cbd1e",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#7cbd1e";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#7cbd1e";
                }}
              >
                Voir détails
                <span style={{ fontSize: "10px" }}>→</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === 'button') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLocation(msg.route);
          }}
          style={{
            padding: "8px 16px",
            backgroundColor: "transparent",
            color: "#7cbd1e",
            border: "1.5px solid #7cbd1e",
            borderRadius: "9999px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#7cbd1e";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#7cbd1e";
          }}
        >
          {msg.text}
          <span style={{ fontSize: "10px" }}>→</span>
        </button>
      );
    }

    // Default text message
    return (
      <>
        {(msg.isUser || msg.status === "read") && msg.text}
        {!msg.isUser && msg.status !== "read" &&
          <Typewriter
            options={{
              stringSplitter,
              autoStart: true,
              delay: typeDelay,
            }}
            onInit={(typewriter) => {
              // When typing starts
              setIsTyping(true);

              typewriter
                .callFunction(() => setIsTyping(true))
                .typeString(msg.text)
                .callFunction(() => {
                  setChatMessages((prev) =>
                    prev.map((m) =>
                      m.id === msg.id ? { ...m, status: "read" } : m
                    )
                  );
                  setTimeout(() => {
                    setIsTyping(false);
                  }, 1000);
                })// When finished typing
                .start();
            }}
          />
        }
      </>
    );
  };

  const handlePropertyClick = (property) => {
    // Navigate to property details or show in modal
    console.log("Property clicked:", property);
    setSelectedProperty(property);
    setTimeout(() => {
      setIsSlideVisible(true);
    }, 100);
  };

  const simulatePropertyRecommendation = () => {
    // Get a random property from topProperties or use enhanced sample data

    const sampleProperty = topProperties?.[getRandomIntInclusive(0, (topProperties.length - 1))];

    const propertyMessage = {
      id: chatMessages.length + 3,
      type: 'property',
      property: sampleProperty,
      isUser: false,
      liked: false,
      timestamp: new Date(),
    };

    const buttonMessage = {
      id: chatMessages.length + 4,
      type: 'button',
      text: "Explorer TranoGasy",
      route: "/tranogasyMap",
      isUser: false,
      timestamp: new Date(),
    };

    const introMessage = (chatMessages.length < 5) ? {
      id: chatMessages.length + 2,
      text: "Mais voici un exemple de ce que je pourrai bientôt faire ! Voici une propriété qui pourrait vous intéresser :",
      isUser: false,
      timestamp: new Date(),
      status: "unread",
    } : buttonMessage;

    // First add the intro message immediately
    setChatMessages(prev => [...prev, introMessage]);


    const timout = (stringSplitter(introMessage.text).length + countWords(introMessage.text)) * typeDelay + 2000;

    // Then add the property message after custion delay
    setTimeout(() => {
      if (chatMessages.length < 5) setChatMessages(prev => [...prev, propertyMessage]);
    }, timout);
  };

  // Add the handleFavoriteClick function
  const handleFavoriteClick = (msg) => {
    console.log("Added to favorites:", msg.property);
    if (user) {
      (!msg.liked) && play();
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, liked: !msg.liked } : m
        )
      );
      (!msg.liked) ? like(msg.property) : disLike(msg.property);
    }
    if (!user) {
      notLogedPopUp();
    }
  };

  const handleSendMessage = () => {
    if (message.trim() === "" || isTyping) return;

    setIsTyping(true);

    // Add user message
    const userMessage = {
      id: chatMessages.length + 1,
      text: message,
      isUser: true,
      timestamp: new Date(),
      status: "read",
    };

    setChatMessages([...chatMessages, userMessage]);
    setMessage("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = (chatMessages.length < 5) ? {
        id: chatMessages.length + 2,
        text: "😅 Oups ! Je suis encore en formation… \nGilbert IA est encore en construction… \nJe m'entraîne pour devenir le meilleur agent immobilier virtuel de Madagascar ! \nBientôt, je pourrai t'aider sur TranoGasy !",
        isUser: false,
        timestamp: new Date(),
        status: "unread",
      } : {
        id: chatMessages.length + 2,
        text: "😢 Je m'excuse sincèrement, mais je ne peux pas vous aider maintenant 🥺. Gilbert Ai n'est pas encore disponible.\n\n 😋 Mais n'hésitez pas à explorer Tranogasy en cliquant sur ce bouton!",
        isUser: false,
        timestamp: new Date(),
        status: "unread",
      };

      // First add the "under construction" message
      setChatMessages(prev => [...prev, aiResponse]);

      const timout = (stringSplitter(aiResponse.text).length + countWords(aiResponse.text)) * typeDelay + 2000;

      // Then after another delay, simulate property recommendation
      setTimeout(() => {
        simulatePropertyRecommendation();
      }, timout);

    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isTyping) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const ItemSize = 400;

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }) => {
      const index = rowIndex * columnCount + columnIndex;
      const property = topProperties?.[index];
      if (!property) return null;
      return (
        <div style={style}>
          <div style={{ padding: "8px", height: "100%" }}>
            <PropertyDetails
              key={property._id}
              property={property}
              route={"ExplorePage"}
              handlePropertyClick={handlePropertyClick}
            />
          </div>
        </div>
      );
    },
    [columnCount, topProperties]
  );

  // useEffect(() => {
  //   console.log(chatMessages, chatMessages.length);

  // }, [chatMessages]);

  return (
    <>
      <div
        id="explorepage"
        className="home"
      >
        <div className="site-section site-section-sm pb-0">
          {/* Smooth HomeSlider */}
          <div
            style={{
              transform: atTheTop ? "scaleY(1)" : "scaleY(0)",
              transformOrigin: "top",
              opacity: atTheTop ? 1 : 0,
              height: atTheTop ? "auto" : "0px",
              transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
              willChange: "transform, opacity, height",
              overflow: "hidden",
            }}
          >
            <HomeSlider setIsChatboxOpen={setIsChatboxOpen} />
          </div>

          <div
            className={`container transition-all duration-500 ${atTheTop ? "mt-1" : "mt-5"}`}
            id="prodisplay"
          >
            <PropertyFilter />
          </div>
        </div>

        <div className="site-section site-section-sm bg-light">
          <div className="custom-container">
            {topProperties && topProperties.length > 0 ?
              (
                <div className="row" ref={gridContainerRef}>
                  {gridWidth > 0 && (
                    <Grid
                      ref={gridRef}
                      columnCount={columnCount}
                      columnWidth={Math.floor(gridWidth / columnCount)}
                      height={window.innerHeight - 80}
                      rowCount={Math.ceil(topProperties.length / columnCount)}
                      rowHeight={(ItemSize / 100) * 106}
                      width={(gridWidth / 100) * 101.5}
                      itemData={topProperties}
                      style={{
                        scrollbarWidth: "none",
                        paddingBottom: "100px",
                        willChange: "scroll-position",
                      }}
                      onScroll={({ scrollTop }) => {
                        const itemHeight = (ItemSize / 100) * 106;
                        const hideThreshold = itemHeight * 1.7;

                        setAtTheTop((prev) => {
                          if (scrollTop <= 0 && !prev) return true;
                          if (scrollTop > hideThreshold && prev) return false;
                          return prev;
                        });
                      }}
                    >
                      {Cell}
                    </Grid>
                  )}
                </div>
              ) : (
                <div className="row mt-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ListingDetailsSkeleton key={index} />
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Chatbot Button and Chatbox */}
      <div
        className="fast-actions"
        style={{
          position: "absolute",
          top: "auto",
          bottom: "70px",
          left: "4dvw",
          zIndex: 1000,
          transform: 'translateZ(0)',
          maxWidth: "60px"
        }}
      >
        <img
          className="gibert-ai-btn"
          onClick={toggleChatbox}
          src={gilbertIALogoDark()}
          alt="Gilbert AI Assistant"
          style={{
            objectFit: "cover",
            padding: "1px",
            height: "56px",
            width: "56px",
            borderRadius: "50%",
            border: "2px solid rgb(128, 128, 128)",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        />

        {/* Chatbox */}
        {isChatboxOpen && (
          <div
            ref={chatboxRef}
            style={{
              position: "absolute",
              bottom: "70px",
              left: "0",
              width: "350px",
              height: "500px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
              border: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 1001,
            }}
          >
            {/* Chat Header */}
            <div
              style={{
                padding: "16px",
                backgroundColor: "#000000",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <img
                src={gilbertIALogoLight()}
                alt="Gilbert AI"
                style={{
                  width: "35px",
                  height: "35px",
                  padding: "1px",
                  border: "1px solid white",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Gilbert AI
                </div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  En ligne <strong className="text-success" style={{ fontSize: "11px" }}>🟢</strong> Prêt à aider
                </div>
              </div>
              <button
                onClick={() => !isTyping && setIsChatboxOpen(false)}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "1px solid rgb(255, 255, 255, 0.8)",
                  borderRadius: "50%",
                  padding: "3px",
                  width: "30px",
                  height: "30px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "18px",
                  opacity: 0.8,
                }}
              >
                ×
              </button>
            </div>

            {/* Chat Messages */}
            <div
              ref={messagesContainerRef}
              className="messages-div"
              style={{
                flex: 1,
                padding: "16px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                backgroundColor: "#f8fafc",
              }}
            >
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: msg.isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "12px 16px",
                      borderRadius: "18px",
                      backgroundColor: msg.isUser ? "#3b82f6" : "white",
                      color: msg.isUser ? "white" : "#333",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      fontSize: "14px",
                      lineHeight: "1.4",
                      wordWrap: "break-word",
                      whiteSpace: "pre-line",
                      fontFamily: `"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Symbol", sans-serif`
                    }}
                  >
                    {renderMessageContent(msg)}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div
              style={{
                padding: "16px",
                borderTop: "1px solid #e0e0e0",
                backgroundColor: "white",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "24px",
                    resize: "none",
                    fontSize: "14px",
                    minHeight: "44px",
                    maxHeight: "100px",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={message.trim() === "" || isTyping}
                  style={{
                    padding: "12px",
                    backgroundColor: "#000000",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "44px",
                    height: "44px",
                    cursor: (message.trim() === "" || isTyping) ? "not-allowed" : "pointer",
                    opacity: (message.trim() === "" || isTyping) ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isTyping ?
                    <Settings className="spin" />
                    :
                    <SendHorizontal />
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* White slider */}
      <div
        className={`property-details-slide ${isSliderVisible ? "show" : ""}`}
        style={{
          position: "fixed",
          left: "50%",
          bottom: 0,
          transform: isSliderVisible
            ? "translate(-50%, 0)"
            : "translate(-50%, 100%)",
          width: "100%",
          height: "99dvh",
          overflowY: "auto",
          backgroundColor: "#fff",
          borderRadius: "30px 30px 0 0",
          boxShadow: "0 -1px 12px hsla(var(--hue), var(--sat), 15%, 0.30)",
          transition: "transform 0.5s ease",
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        {/* mini navbar for the lose button to hide the sliding div */}
        <div
          className="fixed-top"
          style={{
            width: "100%",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "sticky",
          }}
        >
          <IoMdCloseCircle
            style={{
              fontSize: "2rem",
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: "9999",
              backgroundColor: "#fff",
              borderRadius: "50%",
              cursor: "pointer",
              opacity: 1,
              pointerEvents: "auto",
              transition: "opacity 0.3s ease",
            }}
            onClick={() => {
              handleCloseSlideClick();
            }}
          />
        </div>

        {/* Close button to hide the sliding div */}
        {selectedProperty && isSliderVisible && (
          <PropertyDetailsPage
            key={selectedProperty._id}
            fastPreviewProperty={selectedProperty}
            handleCloseSlideClick={handleCloseSlideClick}
          />
        )}

      </div>
    </>
  );
};

export default ExplorePage;