import { useLocation } from "wouter";
import { FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
import { MdArrowBackIos } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTopNavbar, resetAccountRecovery } from "../redux/redux";
import { useAccountRecovery } from "../hooks/useAccountRecovery";
import Swal from "sweetalert2";

const PasswordRecoveryFinalisationPage = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { isLoading, error, bootstrapClassname, resetUsersPassword } = useAccountRecovery();
  const dispatch = useDispatch();

  const inputRef = useRef(null);

  const accountRecovery = useSelector((state) => state.accountRecovery);

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetUsersPassword(accountRecovery.user._id, password, confirmPassword);
    console.log("form submited");
  };

  const handleCancel = () => {
    dispatch(resetAccountRecovery());
    setLocation(`/password-recovery/${accountRecovery.user.phone}`);
  };

  useEffect(() => {
    if (isLoading) {
      // Display the alert
      Swal.fire({
        imageUrl: "images/scan doc.gif",
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

  useEffect(() => {
    async function loadPage() {
      dispatch(setTopNavbar(true))
      inputRef.current.focus();
    }
    loadPage();
  }, []);

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
            "\n        ::-webkit-scrollbar {\n            width: 8px;\n        }\n\n        /* Track */\n        ::-webkit-scrollbar-track {\n            background: #f1f1f1;\n        }\n\n        /* Handle */\n        ::-webkit-scrollbar-thumb {\n            background: #888;\n        }\n\n        /* Handle on hover */\n        ::-webkit-scrollbar-thumb:hover {\n            background: #555;\n        }\n\n        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');\n\n        * {\n            padding: 0;\n            margin: 0;\n            box-sizing: border-box;\n          }\n\n        body {\n      background: #eeeff3;\n        }\n\n        .container {\n            margin: 0px auto;\n        }\n\n        .panel-heading {\n            text-align: center;\n            margin-bottom: 10px;\n        }\n\n        #forgot {\n            min-width: 100px;\n            margin-left: auto;\n            text-decoration: none;\n        }\n\n        a:hover {\n            text-decoration: none;\n        }\n\n        .form-inline label {\n            padding-left: 10px;\n            margin: 0;\n            cursor: pointer;\n        }\n\n        .btn.btn-primary {\n            margin-top: 20px;\n            border-radius: 15px;\n        }\n\n        .panel {\n            min-height: 380px;\n            box-shadow: 20px 20px 80px rgb(218, 218, 218);\n            border-radius: 12px;\n        }\n\n        .input-field {\n            border-radius: 30px;\n            padding: 5px;\n            display: flex;\n            align-items: center;\n            cursor: pointer;\n            border: 1px solid #ddd;\n            color: #7cbd1e;\n        }\n\n        input[type='text'],\n        input[type='password'] {\n            border: none;\n            outline: none;\n            box-shadow: none;\n            width: 100%;\n        }\n\n        .fa-eye-slash.btn {\n            border: none;\n            outline: none;\n            box-shadow: none;\n        }\n\n        img {\n            width: 40px;\n            height: 40px;\n            object-fit: cover;\n            border-radius: 50%;\n            position: relative;\n        }\n\n        a[target='_blank'] {\n            position: relative;\n            transition: all 0.1s ease-in-out;\n        }\n\n        .bordert {\n            border-top: 1px solid #aaa;\n            position: relative;\n        }\n\n        .bordert:after {\n             position: absolute;\n            top: -13px;\n            left: 20%;\n            background-color: #fff;\n            padding: 0px 8px;\n        }\n\n        @media(max-width: 360px) {\n            #forgot {\n                margin-left: 0;\n                padding-top: 10px;\n            }\n\n            body {\n                height: 100%;\n            }\n\n            .container {\n                margin: 0;\n            }\n\n            .bordert:after {\n                left: 25%;\n            }\n        }\n\n      .btn-primary, .btn-primary:active {\n    background-color: #7cbd1e !important;\n    border-color: #7cbd1e !important;\n\n}\n    .btn-primary:hover, .btn-primary:active, .btn-primary:visited {\n    background-color: #C2F784 !important;\n    border-color: #C2F784 !important;\n\n}\n    ",
        }}
      />
      <div className="container">
        <div
          className="row d-flex justify-content-center"
          style={{ marginTop: "70px", marginBottom: "100px" }}
        >
          <div className="col-lg-5 col-md-7">
            <div className="panel border bg-white">
              <div className="panel-heading">
                <h6 className="pt-3 font-weight-light">
                  Création d'un nouveau mot de passe
                </h6>
              </div>
              <div className="d-flex justify-content-center">
                <img
                  alt=""
                  src="images/password-reset.png"
                  style={{ width: "60px" }}
                  className="img-fluid border border-1 mr-1 align-self-start"
                />
              </div>
              <div className="d-flex justify-content-center username">
                <h6 className="font-weight-bold">
                  <u>{accountRecovery.user && accountRecovery.user.username}</u> <br />{" "}
                  <center>
                    <small>({accountRecovery.user && accountRecovery.user.phone})</small>
                  </center>
                </h6>{" "}
                <br />
              </div>
              <div className="panel-body p-3">
                <form action="#" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <div className="input-field">
                      <span className="fas px-2">
                        <FaLock />
                      </span>
                      <input
                        ref={inputRef}
                        value={password}
                        type={showPassword ? "text" : "password"}
                        placeholder="Crée un nouveau mot de passe"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div
                        className="btn bg-white text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="far">
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-field">
                      <span className="fas px-2">
                        <FaLock />
                      </span>
                      <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirmer le mot de passe"
                        required
                      />
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn bg-white text-muted"
                      >
                        <span className="far">
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    style={{ borderRadius: "30px" }}
                    disabled={isLoading}
                    className="btn btn-primary btn-block mt-3"
                  >
                    Modifier
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
              </div>
            </div>
          </div>
        </div>
        {/* bottom navbar */}
        <div class="fixed-bottom bg-white">
          <nav className="d-flex justify-content-start navbar navbar-expand-lg navbar-light">
            <button
              onClick={handleCancel}
              style={{ fontSize: "15px" }}
              className="text-capitalize font-weight-light btn btn-outline-dark border-0"
            >
              <MdArrowBackIos
                style={{ fontSize: "15px", marginBottom: "3px" }}
              />
              Annuler
            </button>
          </nav>
        </div>
        {/* bottom navbar */}
      </div>
    </>
  );
};

export default PasswordRecoveryFinalisationPage;
