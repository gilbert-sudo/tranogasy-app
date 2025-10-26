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
    return () => (document.body.style.overflow = "");
  }, []);

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) dispatch(setPricingField({ key: "pricingModal", value: false }));
  };

  const handleBuying = async (plan, index) => {
    if (isLoading) return; // Prevent multiple clicks
    
    setLoadingPlanIndex(index);
    
    if (plan.amount === 0) {
      const paymentData = {
        user: user._id,
        reason: plan.planName,
        planValidity: plan.planValidity,
      };
      await makeFreePayment(paymentData);
      // Don't close modal here - let the useEffect handle it when isLoading becomes false
      return;
    }
    setLocation(`/payment/${encodeURIComponent(JSON.stringify(plan))}/init`);
    // Don't close modal here - let the useEffect handle it when isLoading becomes false
  };

  const toggleAccordion = (index) => {
    if (isDesktop || isLoading) return; // disable accordion on desktop and during loading
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
        {/* Loading Overlay */}
        {isLoading && (
          <div className="pricing-modal-loading-overlay">
            <div className="pricing-modal-loading-spinner"></div>
            <p>Traitement de votre achat...</p>
          </div>
        )}

        <div className="pricing-modal-header">
          <h2 className="pricing-modal-title">Nos Offres TranoGasy</h2>
          <button 
            className="pricing-modal-close-icon"
            onClick={() => !isLoading && dispatch(setPricingField({ key: "pricingModal", value: false }))}
            disabled={isLoading}
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
                      <div className="pricing-modal-plan-price">Ar {plan.amount}</div>
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
                        handleBuying(plan, index);
                      }}
                      disabled={isLoading}
                    >
                      {isThisPlanLoading ? (
                        <div className="pricing-modal-btn-loading">
                          <div className="pricing-modal-btn-spinner"></div>
                          Traitement...
                        </div>
                      ) : (
                        "Acheter"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="pricing-modal-footer">
          <button 
            onClick={() => !isLoading && dispatch(setPricingField({ key: "pricingModal", value: false }))} 
            className="pricing-modal-back-btn"
            disabled={isLoading}
          >
            <MdArrowBackIos /> Retour
          </button>
        </div>
      </div>
    </>
  );
};

export default PricingModal;