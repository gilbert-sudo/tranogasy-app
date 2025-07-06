import { MapControl } from '@vis.gl/react-google-maps';
import PlaceAutocompleteClassic from './PlaceAutocompleteClassic';

const CustomMapControl = ({ controlPosition, onPlaceSelect }) => {
  return (
    <MapControl position={controlPosition}>
      <div className="autocomplete-control">
        <PlaceAutocompleteClassic onPlaceSelect={onPlaceSelect} />
      </div>
    </MapControl>
  );
};

export default CustomMapControl;
