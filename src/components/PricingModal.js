import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPricingField } from "../redux/redux";
import { useLocation } from "wouter";
import { IoDiamondSharp, IoInfiniteSharp } from "react-icons/io5";
import { MdArrowBackIos, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { usePayment } from "../hooks/usePayment";
import NotLogedIn from "../components/NotLogedIn";
import "./css/PricingModal.css";

const PricingModal = () => {
  const user = useSelector((state) => state.user);
  const plans = useSelector((state) => state.plans);
  const [, setLocation] = useLocation("");
  const dispatch = useDispatch("");
  const { makeFreePayment, isLoading } = usePayment("");

  const [activeIndex, setActiveIndex] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [loadingPlanIndex, setLoadingPlanIndex] = useState(null);
  const [wasLoading, setWasLoading] = useState(false);
  const [confirmationPlan, setConfirmationPlan] = useState(null);
  const [confirmationIndex, setConfirmationIndex] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [countdownInterval, setCountdownInterval] = useState(null);

  // Close modal when loading completes
  useEffect(() => {
    if (wasLoading && !isLoading) {
      dispatch(setPricingField({ key: "pricingModal", value: false }));
    }
    setWasLoading(isLoading);
  }, [isLoading, wasLoading, dispatch]);

  // lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      // Clear any running intervals
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, []);

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setCountdownInterval(interval);
      return () => clearInterval(interval);
    }
  }, [countdown]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading && !confirmationPlan) {
      dispatch(setPricingField({ key: "pricingModal", value: false }));
    }
  };

  const showConfirmation = (plan, index) => {
    setConfirmationPlan(plan);
    setConfirmationIndex(index);
    setCountdown(5); // Start 5-second countdown
  };

  const hideConfirmation = () => {
    setConfirmationPlan(null);
    setConfirmationIndex(null);
    setCountdown(0);
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  };

  const handleBuying = async () => {
    if (isLoading || countdown > 0) return;
    
    setLoadingPlanIndex(confirmationIndex);
    
    if (confirmationPlan.amount === 0) {
      const paymentData = {
        user: user._id,
        reason: confirmationPlan.planName,
        planValidity: confirmationPlan.planValidity,
      };
      await makeFreePayment(paymentData);
      return;
    }
    setLocation(`/payment/${encodeURIComponent(JSON.stringify(confirmationPlan))}/init`);
  };

  const toggleAccordion = (index) => {
    if (isDesktop || isLoading || confirmationPlan) return;
    setActiveIndex(index === activeIndex ? null : index);
  };

  if (!user) {
    return (
      <>
        <div className="pricing-modal-backdrop" onClick={handleBackdropClick} />
        <div className="pricing-modal">
          <NotLogedIn />
          <button 
            className="pricing-modal-close-btn"
            onClick={() => dispatch(setPricingField({ key: "pricingModal", value: false }))}
            disabled={isLoading}
          >
            Fermer
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="pricing-modal-backdrop" onClick={handleBackdropClick} />

      <div className="pricing-modal">
        {/* Confirmation Overlay */}
        {confirmationPlan && (
          <div className="pricing-modal-confirmation-overlay">
            <div className="pricing-modal-confirmation-content">
              <h3>Confirmer votre achat</h3>
              
              <div className="pricing-modal-confirmation-details">
                <div className="confirmation-plan-name">{confirmationPlan.planName}</div>
                <div className="confirmation-plan-price">Ar {confirmationPlan.amount}  {(confirmationPlan.amount <= 0) && "( Gratuit )"}</div>
              </div>

              <div className="pricing-modal-confirmation-text">
                <p>Êtes-vous sûr de vouloir acheter ce plan ?</p>
              </div>

              <div className="pricing-modal-confirmation-actions">
                <button
                  className="pricing-modal-confirm-btn"
                  onClick={handleBuying}
                  disabled={countdown > 0 || isLoading}
                >
                  {countdown > 0 ? (
                    `Confirmer (${countdown}s)`
                  ) : isLoading ? (
                    <div className="pricing-modal-btn-loading">
                      <div className="pricing-modal-btn-spinner"></div>
                      Traitement...
                    </div>
                  ) : (
                    "Confirmer l'achat"
                  )}
                </button>
                
                <button
                  className="pricing-modal-cancel-btn"
                  onClick={hideConfirmation}
                  disabled={isLoading}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && !confirmationPlan && (
          <div className="pricing-modal-loading-overlay">
            <div className="pricing-modal-loading-spinner"></div>
            <p>Traitement de votre achat...</p>
          </div>
        )}

        <div className="pricing-modal-header">
          <h2 className="pricing-modal-title">Nos Offres TranoGasy</h2>
          <button 
            className="pricing-modal-close-icon"
            onClick={() => !isLoading && !confirmationPlan && dispatch(setPricingField({ key: "pricingModal", value: false }))}
            disabled={isLoading || confirmationPlan}
          >
            ×
          </button>
        </div>

        <div className="pricing-modal-container">
          {plans &&
            plans.map((plan, index) => {
              const open = isDesktop || activeIndex === index;
              const isThisPlanLoading = isLoading && loadingPlanIndex === index;
              
              return (
                <div
                  key={index}
                  className={`pricing-modal-card ${open ? "active" : ""} ${isThisPlanLoading ? "loading" : ""}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className={`pricing-modal-header color-${index}`}>
                    <div className="pricing-modal-plan-info">
                      <div className="pricing-modal-plan-name">
                        {plan.planName}
                        {index === 0 && <IoDiamondSharp />}
                        {index === 1 && <IoInfiniteSharp />}
                      </div>
                      <div className="pricing-modal-plan-price">Ar {plan.amount}  {(plan.amount <= 0) && "( Gratuit )"}</div>
                    </div>

                    {!isDesktop && (
                      <div className="pricing-modal-arrow-icon">
                        {open ? (
                          <MdKeyboardArrowUp className="pricing-modal-arrow" />
                        ) : (
                          <MdKeyboardArrowDown className="pricing-modal-arrow" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className={`pricing-modal-body ${open ? "open" : ""}`}>
                    <p>{plan.description}</p>
                    <button
                      className="pricing-modal-buy-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        showConfirmation(plan, index);
                      }}
                      disabled={isLoading || confirmationPlan}
                    >
                      Acheter
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="pricing-modal-footer">
          <button 
            onClick={() => !isLoading && !confirmationPlan && dispatch(setPricingField({ key: "pricingModal", value: false }))} 
            className="pricing-modal-back-btn"
            disabled={isLoading || confirmationPlan}
          >
            <MdArrowBackIos /> Retour
          </button>
        </div>
      </div>
    </>
  );
};

export default PricingModal;