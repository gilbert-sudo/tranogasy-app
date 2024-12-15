import React from "react";
import {
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
} from "@vis.gl/react-google-maps";

import { UndoRedoControl } from "./undo-redo-control.tsx";
import { useDrawingManager } from "./use-drawing-manager.tsx";

const DrawingExample = () => {
  const drawingManager = useDrawingManager();

  return (
    <APIProvider apiKey="AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs">
      <div className="mt-2 mb-4" style={{ height: "50vh", width: "100%" }}>
        <Map
          defaultZoom={3}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          gestureHandling={"greedy"}
        />

        <MapControl position={ControlPosition.TOP_CENTER}>
          <UndoRedoControl drawingManager={drawingManager} />
        </MapControl>
      </div>
    </APIProvider>
  );
};

export default DrawingExample;
