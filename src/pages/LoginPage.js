import { useEffect, useState } from "react";
import { FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
import { useLogin } from "../hooks/useLogin";
import { useImage } from "../hooks/useImage";
import PhoneNumberInput from "../components/PhoneNumberInput";
import Swal from "sweetalert2";
import { Link } from "wouter";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, bootstrapClassname } = useLogin();
  const { mgFlag } = useImage();

  const handlePhoneNumberInput = (e) => {
    // Remove non-numeric characters before updating state
    const numericValue = e.target.value.replace(
      /\D/g,
      ""
    );
    setPhoneNumber(numericValue);
  }; 

  const handleSubmit = (e) => {
    e.preventDefault();
    login(phoneNumber, password);
  };


  useEffect(() => {
    if (isLoading) {
      // Display the alert
      Swal.fire({
        imageUrl: "images/scan doc.gif",
        imageHeight: 50, // Set a max height in pixels
        html: `<p style={{ fontWeight: "400" }}> En train de verifier </p>`,
        allowOutsideClick: false,
        showConfirmButton: false,
        customClass: {
          popup: "smaller-sweet-alert2",
        },
      });
    } else {
      // Close the alert when loading is complete
      Swal.close();
    }
  }, [isLoading]);

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n        ::-webkit-scrollbar {\n            width: 8px;\n        }\n\n        /* Track */\n        ::-webkit-scrollbar-track {\n            background: #f1f1f1;\n        }\n\n        /* Handle */\n        ::-webkit-scrollbar-thumb {\n            background: #888;\n        }\n\n        /* Handle on hover */\n        ::-webkit-scrollbar-thumb:hover {\n            background: #555;\n        }\n\n        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');\n\n        * {\n            padding: 0;\n            margin: 0;\n            box-sizing: border-box;\n            font-family: 'Roboto', sans-serif;\n        }\n\n        body {\n      background: #eeeff3;\n        }\n\n        .container {\n            margin: 0px auto;\n        }\n\n        .panel-heading {\n            text-align: center;\n            margin-bottom: 10px;\n        }\n\n        #forgot {\n            min-width: 100px;\n            margin-left: auto;\n            text-decoration: none;\n        }\n\n        a:hover {\n            text-decoration: none;\n        }\n\n        .form-inline label {\n            padding-left: 10px;\n            margin: 0;\n            cursor: pointer;\n        }\n\n        .btn.btn-primary {\n            margin-top: 20px;\n            border-radius: 15px;\n        }\n\n        .panel {\n            min-height: 380px;\n            box-shadow: 20px 20px 80px rgb(218, 218, 218);\n            border-radius: 12px;\n        }\n\n        .input-field {\n            border-radius: 30px;\n            padding: 5px;\n            display: flex;\n            align-items: center;\n            cursor: pointer;\n            border: 1px solid #ddd;\n            color: #7cbd1e;\n        }\n\n        input[type='text'],\n        input[type='password'] {\n            border: none;\n            outline: none;\n            box-shadow: none;\n            width: 100%;\n        }\n\n        .fa-eye-slash.btn {\n            border: none;\n            outline: none;\n            box-shadow: none;\n        }\n\n      a[target='_blank'] {\n            position: relative;\n            transition: all 0.1s ease-in-out;\n        }\n\n        .bordert {\n            border-top: 1px solid #aaa;\n            position: relative;\n        }\n\n        .bordert:after {\n             position: absolute;\n            top: -13px;\n            left: 20%;\n            background-color: #fff;\n            padding: 0px 8px;\n        }\n\n        @media(max-width: 360px) {\n            #forgot {\n                margin-left: 0;\n                padding-top: 10px;\n            }\n\n            body {\n                height: 100%;\n            }\n\n            .container {\n                margin: 0;\n            }\n\n            .bordert:after {\n                left: 25%;\n            }\n        }\n\n      .btn-primary, .btn-primary:active {\n    background-color: #7cbd1e !important;\n    border-color: #7cbd1e !important;\n\n}\n    .btn-primary:hover, .btn-primary:active, .btn-primary:visited {\n    background-color: #C2F784 !important;\n    border-color: #C2F784 !important;\n\n}\n    ",
        }}
      />
      <div className="container">
        <div
          className="row d-flex justify-content-center"
          style={{ marginTop: "70px", marginBottom: "100px" }}
        >
          <div className="col-lg-5 col-md-7">
            <div className="custom-bg-white panel border">
              <div className="d-flex justify-content-center panel-heading">
                <h4 style={{ width: "max-content" ,borderBottom: "1px solid"}} className="pt-3 font-weight-light">Connexion</h4>
              </div>
              <div className="panel-body p-3">
                <form action="#" onSubmit={handleSubmit}>
                  <div className="form-group py-2">
                    <div className="input-field">
                      <span
                        className="far p-2"
                        style={{ minWidth: "max-content" }}
                      >
                        <div className="d-flex align-items-center justify-content-centre">
                          <img
                            alt="Madagascar"
                            style={{
                              objectFit: "cover",
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%"
                            }}
                            src={mgFlag()}
                          />
                          <div>&nbsp; +261</div>
                        </div>
                      </span>
                      <PhoneNumberInput value={phoneNumber} onChange={handlePhoneNumberInput} />
                    </div>
                  </div>
                  <div className="form-group py-1 pb-2">
                    <div className="input-field">
                      <span className="fas px-2">
                        <FaLock />
                      </span>
                      <input
                        value={password}
                        maxLength={30}
                        type={showPassword ? "text" : "password"}
                        placeholder="Tapez votre mot de passe"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div
                        className="btn custom-bg-white text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="far">
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-inline">
                    {/* <input type="checkbox" name="remember" id="remember" />
                    <label htmlFor="remember" className="text-muted">
                      Enregistrer des données
                    </label> */}
                    <Link
                      to="/password-recovery/"
                      id="forgot"
                      style={{ color: "#7cbd1e" }}
                    >
                      Mot de passe oublié?
                    </Link>
                  </div>
                  <button
                    type="submit"
                    style={{ borderRadius: "30px" }}
                    disabled={isLoading}
                    className="btn btn-secondary btn-block mt-3 mb-2"
                  >
                    Se connecter
                  </button>
                  {error && (
                    <>
                      <br></br>
                      <div className={bootstrapClassname}>
                        <small>{error}</small>
                      </div>
                    </>
                  )}
                </form>
                <div className="d-flex justify-content-center w-100">
                  - ou -
                </div>
                <Link
                  href="/signup"
                  style={{ borderRadius: "30px" }}
                  className="btn btn-primary w-100 font-weight-light mt-2"
                >
                  Créer un compte
                </Link>
                {/* Facebook login button */}
                {/* <button
                  type="button"
                  onClick={onFacebookButton}
                  className="button-7 mt-3"
                >
                  <FaFacebook className="mr-2 mb-1" /> Se connecter avec
                  Facebook
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
