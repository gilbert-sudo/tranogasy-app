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
  console.log(user);

  //stringify the plan details data to pass it as parameter
  const àGÔGÔ24DataString = JSON.stringify(plans[0]);

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
                <div className="col-md-6 col-lg-3">
                  <div className="pricing-success pricing">
                    <div className="title">
                      <a href="/shop"># Tolotra àGOGO - 24 Ora</a>
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
                          <IoDiamondSharp />
                        </span>
                      </div>
                      <div className="starting">à seulement</div>
                      <div className="price">
                        Ar 2000<span> TTC </span>
                      </div>
                    </div>
                    <div className="bottom-box">
                    <p style={{color:"rgb(77 114 23)"}}>Profitez d'un accès complet aux fonctionnalités premium pendant 24 heures avec notre plan àGoGo-24. Explorez les annonces immobilières et maximisez votre expérience pendant toute <strong>une journée</strong>!</p>

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
                        to={`/payment/${encodeURIComponent(àGÔGÔ24DataString)}/init`}
                        className="btn btn-lg btn-success clearfix"
                      >
                        Acheter
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="pricing-error pricing">
                    <div className="title">
                      <a href="/shop"># Tolotra àGOGO - 48 Ora</a>
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
                          <IoInfiniteSharp />
                        </span>
                      </div>
                      <div className="starting">à seulement</div>
                      <div className="price">
                        Ar 3000<span> TTC </span>
                      </div>
                    </div>
                    <div className="bottom-box">
                    <p style={{color:"rgb(77 114 23)"}}>Profitez d'un accès complet aux fonctionnalités premium pendant 48 heures avec notre plan àGoGo-48. Explorez les annonces et profitez au maximum de votre expérience pendant <strong>deux jours</strong>!</p>

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
                        to={`/payment/${encodeURIComponent(àGÔGÔ24DataString)}/init`}
                        className="btn btn-lg btn-danger clearfix"
                      >
                        Acheter
                      </Link>
                    </div>
                  </div>
                </div>
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
