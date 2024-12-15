import React, { useRef, useState } from 'react';
import { Autocomplete, DrawingManager, GoogleMap, Polygon, useJsApiLoader } from '@react-google-maps/api';
import deleteIcon from '../img/remove.png';

const libraries = ['places', 'drawing'];
const MapComponent = () => {

    const mapRef = useRef();
    const polygonRefs = useRef([]);
    const activePolygonIndex = useRef();
    const autocompleteRef = useRef();
    const drawingManagerRef = useRef();

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs",
        libraries
    });

    const [polygons, setPolygons] = useState([/* initial polygons */]);
    const defaultCenter = { lat: 28.626137, lng: 79.821603 };
    const [center, setCenter] = useState(defaultCenter);

    const containerStyle = {
        width: '100%',
        height: '400px',
    };

    const drawingManagerOptions = {
        drawingControl: true,
        drawingControlOptions: {
            position: window.google?.maps?.ControlPosition?.TOP_CENTER,
            drawingModes: [
                window.google?.maps?.drawing?.OverlayType?.MARKER,
                window.google?.maps?.drawing?.OverlayType?.CIRCLE,
                window.google?.maps?.drawing?.OverlayType?.POLYGON,
                window.google?.maps?.drawing?.OverlayType?.POLYLINE,
                window.google?.maps?.drawing?.OverlayType?.RECTANGLE,
            ],
        },
        markerOptions: {
            icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        },
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1,
        },
        polygonOptions: {
            fillOpacity: 0.3,
            fillColor: '#ff0000',
            strokeColor: '#ff0000',
            strokeWeight: 2,
            draggable: true,
            editable: true,
        },
    };

    const onLoadMap = (map) => {
        mapRef.current = map;
    };

    const onLoadPolygon = (polygon, index) => {
        polygonRefs.current[index] = polygon;
    };

    const onClickPolygon = (index) => {
        activePolygonIndex.current = index;
    };

    const onOverlayComplete = ($overlayEvent) => {
        drawingManagerRef.current.setDrawingMode(null);
        if ($overlayEvent.type === window.google.maps.drawing.OverlayType.POLYGON) {
            const newPolygon = $overlayEvent.overlay.getPath().getArray().map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }));
            const startPoint = newPolygon[0];
            newPolygon.push(startPoint);
            $overlayEvent.overlay?.setMap(null);
            setPolygons([...polygons, newPolygon]);
        }
    };

    const onDeleteDrawing = () => {
        const filtered = polygons.filter((polygon, index) => index !== activePolygonIndex.current);
        setPolygons(filtered);
    };

    return (
        isLoaded ?
        <div className='map-container' style={{ position: 'relative' }}>
            {drawingManagerRef.current && (
                <div
                    onClick={onDeleteDrawing}
                    title='Delete shape'
                    style={{ cursor: 'pointer', backgroundImage: `url(${deleteIcon})`, height: '24px', width: '24px', marginTop: '5px', backgroundColor: '#fff', position: 'absolute', top: '2px', left: '52%', zIndex: 99999 }}
                />
            )}
            <GoogleMap
                zoom={15}
                center={center}
                onLoad={onLoadMap}
                mapContainerStyle={containerStyle}
                mapTypeControlOptions = {{
                    style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: window.google.maps.ControlPosition.TOP_CENTER,
                }}
            >
                <DrawingManager
                    onLoad={(drawingManager) => drawingManagerRef.current = drawingManager}
                    onOverlayComplete={onOverlayComplete}
                    options={drawingManagerOptions}
                />
                {polygons.map((iterator, index) => (
                    <Polygon
                        key={index}
                        onLoad={(event) => onLoadPolygon(event, index)}
                        onMouseDown={() => onClickPolygon(index)}
                        options={drawingManagerOptions.polygonOptions}
                        paths={iterator}
                        draggable
                        editable
                    />
                ))}
                <Autocomplete onLoad={(autocomplete) => autocompleteRef.current = autocomplete}>
                    <input
                        type='text'
                        placeholder='Search Location'
                        style={{ boxSizing: 'border-box', border: '1px solid transparent', width: '240px', height: '38px', padding: '0 12px', borderRadius: '3px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)', fontSize: '14px', outline: 'none', textOverflow: 'ellipses', position: 'absolute', right: '8%', top: '11px', marginLeft: '-120px' }}
                    />
                </Autocomplete>
            </GoogleMap>
        </div>
        : null
    );
};

export default MapComponent;
