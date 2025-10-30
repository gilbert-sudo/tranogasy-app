import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";

import PropertyDetailsPage from "../pages/PropertyDetailsPage";

import { useImage } from "../hooks/useImage";
import { useLike } from "../hooks/useLike";
import { useLogin } from "../hooks/useLogin";
import useSound from "use-sound";

import { useSelector, useDispatch } from "react-redux";
import { setGilbertAiField } from "../redux/redux";
import Typewriter from "typewriter-effect";
import GraphemeSplitter from "grapheme-splitter";

import { Settings, SendHorizontal, MapPin, Heart, X, Move, BrainCircuit, Gamepad2 } from "lucide-react";
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

const GilbertAi = () => {
  const topProperties = useSelector((state) => state.topProperties);
  const gilbertAi = useSelector((state) => state.gilbertAi);
  const user = useSelector((state) => state.user);

  const [, setLocation] = useLocation();
  const dispatch = useDispatch();
  const chatboxRef = useRef();
  const messagesEndRef = useRef();
  const messagesContainerRef = useRef();
  const buttonRef = useRef();
  const { gilbertIALogoDark, gilbertIALogoLight } = useImage();
  const { like, disLike } = useLike();
  const { notLogedPopUp } = useLogin();
  const [play] = useSound("sounds/Like Sound Effect.mp3");

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSliderVisible, setIsSlideVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Draggable states
  const [buttonPosition, setButtonPosition] = useState({ x: 20, y: 150 });
  const [chatboxPosition, setChatboxPosition] = useState({ x: 20, y: 80 });
  const [isDraggingButton, setIsDraggingButton] = useState(false);
  const [isDraggingChatbox, setIsDraggingChatbox] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTutorial, setShowTutorial] = useState(false);

  const [chatMessages, setChatMessages] = useState(gilbertAi.chatMessages);

  useEffect(() => {
    dispatch(setGilbertAiField({ key: "chatMessages", value: chatMessages }));
  }, [chatMessages]);

  // Load positions from localStorage on component mount
  useEffect(() => {
    const savedButtonPos = localStorage.getItem('gilbertAiButtonPosition');
    const savedChatboxPos = localStorage.getItem('gilbertAiChatboxPosition');
    const tutorialShown = localStorage.getItem('gilbertAiTutorialShown');

    if (savedButtonPos) {
      setButtonPosition(JSON.parse(savedButtonPos));
    }
    if (savedChatboxPos) {
      setChatboxPosition(JSON.parse(savedChatboxPos));
    }
    if (tutorialShown) {
      setShowTutorial(false);
    } else {
      setTimeout(() => {
        setShowTutorial(true);
      }, 4000);
    }
  }, []);

  // Save positions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('gilbertAiButtonPosition', JSON.stringify(buttonPosition));
  }, [buttonPosition]);

  useEffect(() => {
    localStorage.setItem('gilbertAiChatboxPosition', JSON.stringify(chatboxPosition));
  }, [chatboxPosition]);

  function setIsChatboxOpen(state) {
    dispatch(setGilbertAiField({ key: "isChatboxOpen", value: state }));
  }

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
    if (gilbertAi.isChatboxOpen) {
      scrollToBottom("instant");
    }
  }, [gilbertAi.isChatboxOpen]);

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
    setSelectedProperty(null);
  };

  // Draggable functionality for button
  const handleButtonMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingButton(true);
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleButtonTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDraggingButton(true);
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  // Draggable functionality for chatbox
  const handleChatboxMouseDown = (e) => {
    if (e.target.closest('.messages-div') || e.target.closest('textarea') || e.target.closest('button')) {
      return;
    }
    e.preventDefault();
    setIsDraggingChatbox(true);
    const rect = chatboxRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleChatboxTouchStart = (e) => {
    if (e.target.closest('.messages-div') || e.target.closest('textarea') || e.target.closest('button')) {
      return;
    }
    const touch = e.touches[0];
    setIsDraggingChatbox(true);
    const rect = chatboxRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  // Handle drag movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingButton) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Constrain to viewport
        const maxX = window.innerWidth - 60;
        const maxY = window.innerHeight - 60;

        setButtonPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      } else if (isDraggingChatbox) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Constrain to viewport
        const maxX = window.innerWidth - 350;
        const maxY = window.innerHeight - 500;

        setChatboxPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      if (isDraggingButton) {
        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;

        // Constrain to viewport
        const maxX = window.innerWidth - 60;
        const maxY = window.innerHeight - 60;

        setButtonPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      } else if (isDraggingChatbox) {
        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;

        // Constrain to viewport
        const maxX = window.innerWidth - 350;
        const maxY = window.innerHeight - 500;

        setChatboxPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingButton(false);
      setIsDraggingChatbox(false);
    };

    if (isDraggingButton || isDraggingChatbox) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingButton, isDraggingChatbox, dragOffset]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Adjust button position if needed
      const maxButtonX = window.innerWidth - 60;
      const maxButtonY = window.innerHeight - 60;

      setButtonPosition(prev => ({
        x: Math.min(prev.x, maxButtonX),
        y: Math.min(prev.y, maxButtonY)
      }));

      // Adjust chatbox position if needed
      const maxChatboxX = window.innerWidth - 350;
      const maxChatboxY = window.innerHeight - 500;

      setChatboxPosition(prev => ({
        x: Math.min(prev.x, maxChatboxX),
        y: Math.min(prev.y, maxChatboxY)
      }));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Close chatbox when clicking outside (only if not typing)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isTyping) return;
      if (
        chatboxRef.current &&
        !chatboxRef.current.contains(event.target) &&
        !event.target.closest(".gibert-ai-btn") &&
        !isDraggingChatbox
      ) {
        setIsChatboxOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTyping, isDraggingChatbox]);

  const toggleChatbox = () => {
    if (isTyping) return;
    if (showTutorial) setShowTutorial(false);
    setIsChatboxOpen(!gilbertAi.isChatboxOpen);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('gilbertAiTutorialShown', 'true');
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
            !isTyping && setIsChatboxOpen(false)
            handleCloseSlideClick();
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
    setIsSlideVisible(true);
    !isTyping && setIsChatboxOpen(false)
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

  // lock scroll when tutorial is open
  useEffect(() => {
    if (showTutorial) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTutorial]);

  return (
    <>
      {/* Tutorial Tooltip */}
      {showTutorial && (
        <>
          <div
            style={{
              position: "absolute",
              top: "-100%",
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              cursor: "pointer",
              minWidth: "100dvw",
              minHeight: "100dvh",
            }}
            onClick={closeTutorial}
          />
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "30px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            zIndex: 10000,
            maxWidth: "400px",
            width: "90%",
            border: "2px solid #7cbd1e"
          }}>
            {/* Semi-transparent backdrop */}

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px"
            }}>
              <div className="d-flex justify-content-center">
                <img src={gilbertIALogoDark()} alt="gilbert ai" className="img-fluid" style={{ borderRadius: "50%", marginRight: "5px", width: "30px", height: "30px" }} />
                <h4 style={{ margin: 0, color: "#1f2937" }}>  Gilbert AI <small style={{ fontSize: "10px", fontWeight: "bold" }}>( Nouveau )</small></h4>
              </div>
              <button
                onClick={closeTutorial}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#6b7280"
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <p style={{ margin: "10px 0", fontSize: "14px", lineHeight: "1.5" }}>
                <strong>✨ Fonctionnalités :</strong>
              </p>
              <ul style={{ paddingLeft: "20px", fontSize: "14px", lineHeight: "1.5" }}>
                <li><strong>Assistant IA immobilier</strong> pour vous aider à trouver votre propriété idéale</li>
                <li><strong>Glisser-déposer</strong> : Déplacez le bouton et la fenêtre de chat où vous voulez</li>
                <li><strong>Interface responsive</strong> qui s'adapte à tous vos appareils</li>
              </ul>

              <p style={{ margin: "15px 0 5px 0", fontSize: "14px", lineHeight: "1.5" }}>
                <strong><Gamepad2 className="mb-1" size={20} /> Comment déplacer :</strong>
              </p>
              <ul style={{ paddingLeft: "20px", fontSize: "14px", lineHeight: "1.5" }}>
                <li><strong>Souris</strong> : Cliquez et maintenez, puis glissez</li>
                <li><strong>Écran tactile</strong> : Touchez et maintenez, puis glissez</li>
                <li>Recherchez l'icône <Move size={22} style={{ color: "white", borderRadius: "50%", padding: "5px", display: "inline", marginBottom: "-2px", backgroundColor: "#7cbd1e" }} /> pour les éléments déplaçables</li>
              </ul>
            </div>

            <button
              onClick={closeTutorial}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#7cbd1e",
                color: "white",
                border: "none",
                borderRadius: "9999px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold"
              }}
            >
              Compris, commençons !
            </button>
          </div>
        </>
      )}

      {/* Gilbert AI Button - Now Draggable */}
      <div
        ref={buttonRef}
        className="gibert-ai-btn"
        style={{
          position: "fixed",
          left: `${buttonPosition.x}px`,
          top: `${buttonPosition.y}px`,
          zIndex: 9999,
          cursor: isDraggingButton ? "grabbing" : "grab",
          touchAction: "none",
          userSelect: "none",
          transform: 'translateZ(0)',
        }}
        onMouseDown={handleButtonMouseDown}
        onTouchStart={handleButtonTouchStart}
      >
        <img
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
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        />
        {/* Drag handle indicator */}
        <div style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          backgroundColor: "#7cbd1e",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}>
          <Move size={12} />
        </div>
      </div>

      {/* Chatbox - Now Draggable */}
      {gilbertAi.isChatboxOpen && (
        <div
          ref={chatboxRef}
          style={{
            position: "fixed",
            left: `${chatboxPosition.x}px`,
            top: `${chatboxPosition.y}px`,
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
            cursor: isDraggingChatbox ? "grabbing" : "default",
            touchAction: "none",
            userSelect: "none",
          }}
          onMouseDown={handleChatboxMouseDown}
          onTouchStart={handleChatboxTouchStart}
        >
          {/* Chat Header with Drag Handle */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "#000000",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "move",
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
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                Gilbert AI <small className="font-weight-light">(Beta)</small>
              </div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>
                En ligne <strong className="text-success" style={{ fontSize: "11px" }}>🟢</strong> Prêt à aider
              </div>
            </div>

            {/* Drag Indicator */}
            <Move
              size={22}
              style={{
                opacity: 1,
                marginRight: "8px",
                color: "white",
                borderRadius: "50%",
                padding: "5px",
                backgroundColor: "#7cbd1e"
              }}
            />

            <button
              onClick={() => !isTyping && setIsChatboxOpen(false)}
              style={{
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
              cursor: "default",
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
                    backgroundColor: msg.isUser ? "#000000" : "white",
                    color: msg.isUser ? "white" : "#333",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    fontSize: "14px",
                    fontFamily: `"Segoe UI Emoji", sans-serif`,
                    lineHeight: "1.4",
                    wordWrap: "break-word",
                    whiteSpace: "pre-line",
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
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isTyping ? "Gilbert AI écrit..." : "Tapez votre message..."}
                disabled={isTyping}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "24px",
                  resize: "none",
                  outline: "none",
                  fontSize: "16px",
                  lineHeight: "1.4",
                  maxHeight: "100px",
                  minHeight: "40px",
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || message.trim() === ""}
                style={{
                  backgroundColor: isTyping || message.trim() === "" ? "#ccc" : "#000000",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  cursor: isTyping || message.trim() === "" ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isTyping ?
                  <Settings className="spin" />
                  :
                  <SendHorizontal size={18} />
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Details Slider */}
      {/* {isSliderVisible && selectedProperty && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "90%",
              height: "90%",
              backgroundColor: "white",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <button
              onClick={handleCloseSlideClick}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
            <PropertyDetailsPage
              key={selectedProperty._id}
              fastPreviewProperty={selectedProperty}
              handleCloseSlideClick={handleCloseSlideClick}
            />
          </div>
        </div>
      )} */}
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

export default GilbertAi;