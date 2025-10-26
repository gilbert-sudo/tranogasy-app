import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "wouter";
import { IoDiamondSharp, IoInfiniteSharp } from "react-icons/io5";
import { MdArrowBackIos, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { usePayment } from "../hooks/usePayment";
import NotLogedIn from "../components/NotLogedIn";
import "./css/pricing.css";

const Pricing = () => {
  const user = useSelector((state) => state.user);
  const plans = useSelector((state) => state.plans);
  const [, setLocation] = useLocation("");
  const { makeFreePayment } = usePayment("");

  const [activeIndex, setActiveIndex] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBuying = async (plan) => {
    if (plan.amount === 0) {
      const paymentData = {
        user: user._id,
        reason: plan.planName,
        planValidity: plan.planValidity,
      };
      makeFreePayment(paymentData);
      return;
    }
    setLocation(`/payment/${encodeURIComponent(JSON.stringify(plan))}/init`);
  };

  const toggleAccordion = (index) => {
    if (isDesktop) return; // disable accordion on desktop
    setActiveIndex(index === activeIndex ? null : index);
  };

  if (!user) return <NotLogedIn />;

  return (
    <div className="pricing-page pt-5">
      <h2 className="pricing-title">Nos Offres TranoGasy</h2>

      <div className="pricing-container">
        {plans &&
          plans.map((plan, index) => {
            const open = isDesktop || activeIndex === index;
            return (
              <div
                key={index}
                className={`pricing-card ${open ? "active" : ""}`}
                onClick={() => toggleAccordion(index)}
              >
                <div className={`pricing-header color-${index}`}>
                  <div className="plan-info">
                    <div className="plan-name">
                      {plan.planName}
                      {index === 0 && <IoDiamondSharp />}
                      {index === 1 && <IoInfiniteSharp />}
                    </div>
                    <div className="plan-price">Ar {plan.amount}</div>
                  </div>

                  <div className="arrow-icon">
                    {open ? (
                      <MdKeyboardArrowUp className="arrow" />
                    ) : (
                      <MdKeyboardArrowDown className="arrow" />
                    )}
                  </div>
                </div>

                <div className={`pricing-body ${open ? "open" : ""}`}>
                  <p>{plan.description}</p>
                  <button
                    className="buy-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuying(plan);
                    }}
                  >
                    Acheter
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <div className="bottom-bar">
        <button onClick={() => window.history.back()} className="back-btn">
          <MdArrowBackIos /> Retour
        </button>
      </div>
    </div>
  );
};

export default Pricing;
