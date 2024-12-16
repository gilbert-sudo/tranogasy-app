import { Link } from "wouter";
import { useSelector } from "react-redux";
import NotLogedIn from "../components/NotLogedIn";
import { IoInfiniteSharp, IoDiamondSharp } from "react-icons/io5";
import { IoMdStar, IoMdStarOutline, IoMdStarHalf } from "react-icons/io";
import { MdArrowBackIos } from "react-icons/md";
import "./css/pricing.css";

const Pricing = () => {
  // redux
  const user = useSelector((state) => state.user);
  const plans = useSelector((state) => state.plans);
  console.log(plans);

  return (
    <>
      <div className="pricing">
        {user && user ? (
          <div className="pricing mt-5 p-2">
            <link
              href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
              rel="stylesheet"
            />
            <div className="container">
              <div className="row d-flex justify-content-center">

                {plans && plans.map((plan, index) => (
                  <div className="col-md-6 col-lg-3">
                  <div className={`${index === 0 && "pricing-success"} ${index === 1 && "pricing-error"} pricing`}>
                    <div className="title">
                      # Tolotra {plan?.planName}
                    </div>
                    <div className="price-box">
                      <div className="icon pull-right border circle">
                        <span
                          className="livicon livicon-processed"
                          data-n="piggybank"
                          data-s={32}
                          data-c="#9ab71a"
                          data-hc={0}
                          id="livicon-3"
                          style={{ width: 32, height: 32 }}
                        >
                          {index === 0 && <IoDiamondSharp />}
                          {index === 1 && <IoInfiniteSharp />}
                        </span>
                      </div>
                      <div className="starting">à seulement</div>
                      <div className="price">
                        Ar {plan?.amount}<span> TTC </span>
                      </div>
                    </div>
                    <div className="bottom-box">
                      <p style={{ color: "rgb(77 114 23)" }}>{plan?.description}</p>

                      <a href="/shop" className="more">
                        Laisser un avis <span className="fa fa-angle-right" />
                      </a>
                      <div className="rating-box">
                        <div className="rating">
                          <IoMdStar className="rating-star" />
                          <IoMdStar className="rating-star" />
                          <IoMdStar className="rating-star" />
                          <IoMdStarHalf className="rating-star" />
                          <IoMdStarOutline className="rating-star" />
                        </div>
                      </div>
                      <Link
                        to={`/payment/${encodeURIComponent(JSON.stringify(plan))}/init`}
                        className={`btn btn-lg ${index === 0 && "btn-success"} ${index === 1 && "btn-danger"} clearfix`}
                      >
                        Acheter
                      </Link>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <NotLogedIn />
        )}
      </div>
      {/* bottom navbar */}
      <div class="fixed-bottom bg-white">
        <nav className="d-flex justify-content-start navbar navbar-expand-lg navbar-light">
          <button
            onClick={() => window.history.back()}
            style={{ fontSize: "15px" }}
            className="text-capitalize font-weight-light btn btn-outline-dark border-0"
          >
            <MdArrowBackIos style={{ fontSize: "15px", marginBottom: "3px" }} />
            Retour
          </button>
        </nav>
      </div>
      {/* bottom navbar */}
    </>
  );
};

export default Pricing;
