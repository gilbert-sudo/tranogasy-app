import {
  APIProvider,
  Map,
} from "@vis.gl/react-google-maps";
import Circle from "../components/Circle";


export default function PlaceLocationDisplayer({ position }) {

  const mapZoom = 15;
  const center = position;

  return (
    <APIProvider apiKey="AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs">
      <div
        className="mt-2 mb-4"
        style={{
          height: "18dvh",
          width: "100%",
          position: "relative", // important for z-index to work
        }}
      >
        {mapZoom && center &&
          <Map
            zoom={mapZoom}
            minZoom={6}
            center={center}
            mapId="80e7a8f8db80acb5"
            options={{ gestureHandling: "cooperative" }}
          >
              <Circle
                center={position}
                radius={800}
                strokeColor={"#7cbd1e"}
                strokeOpacity={1}
                strokeWeight={2}
                fillColor={"#3b82f6"}
                fillOpacity={0.1}
                clickable={false}
              />
          </Map>
        }
      </div>
    </APIProvider>
  );
}
