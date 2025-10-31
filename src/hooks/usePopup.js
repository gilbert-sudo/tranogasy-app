import { useLocation } from "wouter";
import Swal from "sweetalert2";

export const usePopup = () => {

  const [, setLocation] = useLocation("");

  const featureUnderConstructionPopup = async () => {
    Swal.fire({
      html: `<img src="images/WorkingOn.jpg" style="border-radius: 15px;" alt="please log in" class="img-fluid"><br>  <p style={{ fontWeight: "400" }}>
        Nos développeurs travaillent actuellement sur cette fonctionnalité,
        qui sera bientôt disponible. Nous nous excusons pour la gêne occasionnée et vous remercions de
        votre patience.
      </p>`,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: "ok",
      confirmButtonColor: "#7cbd1e",
      customClass: {
        popup: "smaller-sweet-alert",
      },
    });
  };

  const listingOptionPopup = async () => {
    Swal.fire({
      title: " ",
      html: `  <div class="d-flex justify-content-center w-100">
                <div
                  id="houseOption"
                  style="cursor: pointer;"
                  class="d-flex align-items-center justify-content-start ad-category-card m-2 bg-white"
                >
                  <div class="d-flex align-items-center flex-column ad-category-card-body my-3">
                    <h1>
                      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="64px" height="64px" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <g><path style="opacity:0.787" fill="#000000" d="M 63.5,32.5 C 63.5,34.1667 63.5,35.8333 63.5,37.5C 62.5,37.5 61.5,37.5 60.5,37.5C 60.5,43.5 60.5,49.5 60.5,55.5C 61.5,55.5 62.5,55.5 63.5,55.5C 63.5,56.8333 63.5,58.1667 63.5,59.5C 42.1667,60.8333 20.8333,60.8333 -0.5,59.5C -0.5,58.1667 -0.5,56.8333 -0.5,55.5C 0.5,55.5 1.5,55.5 2.5,55.5C 2.5,49.5 2.5,43.5 2.5,37.5C 1.5,37.5 0.5,37.5 -0.5,37.5C -0.5,35.8333 -0.5,34.1667 -0.5,32.5C 2.24074,25.454 4.90741,18.2873 7.5,11C 17.1609,10.5002 26.8276,10.3335 36.5,10.5C 36.3367,8.14316 36.5034,5.80982 37,3.5C 40.6667,2.16667 44.3333,2.16667 48,3.5C 48.4966,5.80982 48.6633,8.14316 48.5,10.5C 51.1194,10.2317 53.6194,10.565 56,11.5C 58.2349,18.7122 60.7349,25.7122 63.5,32.5 Z M 41.5,7.5 C 42.5,7.5 43.5,7.5 44.5,7.5C 44.5,8.5 44.5,9.5 44.5,10.5C 43.5,10.5 42.5,10.5 41.5,10.5C 41.5,9.5 41.5,8.5 41.5,7.5 Z M 10.5,15.5 C 24.5159,15.1674 38.5159,15.5008 52.5,16.5C 54.4066,22.0549 56.4066,27.5549 58.5,33C 52.5,33.6667 46.5,33.6667 40.5,33C 37.9114,29.9031 34.9114,27.4031 31.5,25.5C 28.0886,27.4031 25.0886,29.9031 22.5,33C 16.5,33.6667 10.5,33.6667 4.5,33C 6.79832,27.2718 8.79832,21.4385 10.5,15.5 Z M 30.5,31.5 C 33.2254,32.713 35.5588,34.5464 37.5,37C 43.4908,37.4995 49.4908,37.6662 55.5,37.5C 55.5,43.5 55.5,49.5 55.5,55.5C 49.5,55.5 43.5,55.5 37.5,55.5C 37.5,50.5 37.5,45.5 37.5,40.5C 33.5,40.5 29.5,40.5 25.5,40.5C 25.5,45.5 25.5,50.5 25.5,55.5C 19.5,55.5 13.5,55.5 7.5,55.5C 7.5,49.5 7.5,43.5 7.5,37.5C 13.5092,37.6662 19.5092,37.4995 25.5,37C 27.3734,35.2962 29.0401,33.4628 30.5,31.5 Z M 15.5,45.5 C 17.337,45.6395 17.6704,46.3061 16.5,47.5C 15.7025,47.0431 15.3691,46.3764 15.5,45.5 Z M 30.5,45.5 C 31.7773,46.6936 32.4439,48.3603 32.5,50.5C 32.1667,52.1667 31.8333,53.8333 31.5,55.5C 30.513,52.2317 30.1796,48.8984 30.5,45.5 Z M 45.5,45.5 C 47.337,45.6395 47.6704,46.3061 46.5,47.5C 45.7025,47.0431 45.3691,46.3764 45.5,45.5 Z"/></g>
                      <g><path style="opacity:0.778" fill="#000000" d="M 10.5,40.5 C 14.5,40.5 18.5,40.5 22.5,40.5C 22.5,44.5 22.5,48.5 22.5,52.5C 18.5,52.5 14.5,52.5 10.5,52.5C 10.5,48.5 10.5,44.5 10.5,40.5 Z M 15.5,45.5 C 15.3691,46.3764 15.7025,47.0431 16.5,47.5C 17.6704,46.3061 17.337,45.6395 15.5,45.5 Z"/></g>
                      <g><path style="opacity:0.778" fill="#000000" d="M 40.5,40.5 C 44.5,40.5 48.5,40.5 52.5,40.5C 52.5,44.5 52.5,48.5 52.5,52.5C 48.5,52.5 44.5,52.5 40.5,52.5C 40.5,48.5 40.5,44.5 40.5,40.5 Z M 45.5,45.5 C 45.3691,46.3764 45.7025,47.0431 46.5,47.5C 47.6704,46.3061 47.337,45.6395 45.5,45.5 Z"/></g>
                      </svg>
                    </h1>
                    <div class="">
                      <h6 class="font-weight-bold text-dark mt-1">Maison</h6>
                    </div>
                  </div>
                </div>
                <div
                  id="landOption"
                  style="cursor: pointer;"
                  class="d-flex align-items-center justify-content-start ad-category-card m-2 bg-white"
                >
                  <div class="d-flex align-items-center flex-column ad-category-card-body my-3">
                    <h1>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="64px" height="64px" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g><path style="opacity:0.784" fill="#000000" d="M 35.5,9.5 C 46.8598,8.71005 50.1931,13.5434 45.5,24C 34.9641,27.997 30.4641,24.497 32,13.5C 32.6897,11.6498 33.8564,10.3164 35.5,9.5 Z M 37.5,14.5 C 42.1585,14.0146 43.4919,15.848 41.5,20C 36.7282,20.8104 35.3948,18.9771 37.5,14.5 Z"/></g>
                    <g><path style="opacity:0.829" fill="#000000" d="M 21.5,22.5 C 23.2624,22.3573 24.9291,22.6906 26.5,23.5C 29.5276,27.3612 32.3609,31.3612 35,35.5C 36.5292,34.2713 37.6959,32.7713 38.5,31C 40.5,30.3333 42.5,30.3333 44.5,31C 48.5467,36.2582 52.7134,41.4248 57,46.5C 57.6667,48.5 57.6667,50.5 57,52.5C 40.2406,53.6579 23.4073,53.8245 6.5,53C 4.6751,51.5341 4.1751,49.7008 5,47.5C 10.0134,38.7953 15.5134,30.4619 21.5,22.5 Z M 23.5,28.5 C 27.4701,33.0836 30.9701,38.0836 34,43.5C 35.4443,45.1554 37.2776,45.822 39.5,45.5C 37.4935,41.8629 38.1602,38.8629 41.5,36.5C 45.3238,40.4929 48.9905,44.6596 52.5,49C 38.4881,49.8328 24.4881,49.6661 10.5,48.5C 14.8438,41.805 19.1771,35.1383 23.5,28.5 Z"/></g>
                    </svg>
                    </h1>
                    <div class="">
                      <h6 class="font-weight-bold text-dark mt-1">Terrain</h6>
                    </div>
                  </div>
                </div>
              </div>`,
      showCloseButton: true,
      showConfirmButton: false,
      focusConfirm: false,
      confirmButtonColor: "#7cbd1e",
      customClass: {
        popup: "smaller-sweet-alert",
      },
      didOpen: () => {
        document.getElementById("houseOption").addEventListener("click", () => {
          setLocation("/create-listing");
          Swal.close(); // Close the popup
        });
  
        document.getElementById("landOption").addEventListener("click", () => {
          // setLocation("/create-land-listing");
          Swal.close(); // Close the popup
          featureUnderConstructionPopup();
        });
      }
    });
  };

  const unpaidBillPopup = async () => {
    Swal.fire({
      html: `<img src="images/unpaid-bill.jpg" style="border-radius: 15px;" alt="redo the payment please" class="img-fluid"><br> Il y a eu un problème avec votre dernier paiement. Veuillez le régulariser pour débloquer à nouveau cette fonctionnalité.`,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Voir le paiement",
      confirmButtonColor: "#7cbd1e",
      cancelButtonText: "Fermer",
      cancelButtonColor: "#F31559",
      customClass: {
        popup: "smaller-sweet-alert",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setLocation("/payment-recovery");
      }
    });
  }

  return {
    featureUnderConstructionPopup,
    listingOptionPopup,
    unpaidBillPopup,
  };
};
