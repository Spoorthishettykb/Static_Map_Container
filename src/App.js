import React, { useReducer, useState } from "react";
import { MapContainer, TileLayer, Polygon, Rectangle, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./App.css";
import { statesData } from "./data/data";
import { checkIntersect } from "./util/checkIntersect";
import { reducer, initalStates } from "./hooks/reducer";

const center = [15.225861515798712, 75.7420330339098];

export default function App() {
  const [{ startLatLng, endLatLng, startPoint, endPoint }, dispatch] =
    useReducer(reducer, initalStates);

  const [selection, setSelection] = useState(true);
  // const [markers, setMarkers] = useState([]);

  const handleMouseClick = (e) => {
    setSelection((prevdata) => !prevdata);

    if (selection) {
      const { lat, lng } = e.latlng;
      dispatch({ type: "startpoint", payload: [lat, lng] });
    } else {
      const { lat, lng } = e.latlng;
      dispatch({ type: "endpoint", payload: [lat, lng] });
    }
  };

  // const handleAddMarker = (e) => {
  //   const { lat, lng } = e.latlng;
  //   const newMarker = {
  //     position: [lat, lng],
  //     info: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
  //   };
  //   setMarkers([...markers, newMarker]);
  // };

  const markers = [
    {
      position: [14.4644, 75.9218],
      info: "Davanagere",
    },
    {
      position: [12.971599, 77.594566],
      info: "benglore",
    },
    {
      position: [18.5204, 73.8567],
      info: "Pune",
    },
    // Add more markers as needed
  ];
  

  return (
    <div className="main">
      <MapContainer
        center={center}
        zoom={7}
        style={{ width: "100%", height: "100vh" }}
        // onClick={(e) => handleAddMarker(e)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          onClick={() => {
            console.log("map");
          }}
        />

        {statesData.features.map((state) => {
          var res;
          const coordinates = state.geometry.coordinates[0].map((item) => [
            item[1],
            item[0],
          ]);
          if (endPoint[0] !== undefined && endPoint !== [] && selection) {
            res = checkIntersect([coordinates], startPoint, endPoint);
          }
          return (
            <Polygon
              key={state.properties.name}
              pathOptions={{
                fillColor: res ? "red" : "#ffffff10",
                color: res ? "red" : "white",
                opacity: res ? 5 : 0.1,
                weight: 1,
              }}
              positions={coordinates}
              eventHandlers={{
                click: (e) => {
                  handleMouseClick(e);
                  const layer = e.target;
                  layer.setStyle({
                    weight: 2,
                    opacity: 0.2,
                    fillColor: "#ffffff87",
                    color: "red",
                  });
                },
              }}
            />
          );
        })}

        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>{marker.info}</Popup>
          </Marker>
        ))}

        {startLatLng && endLatLng && selection && (
          <Rectangle
            bounds={[startLatLng, endLatLng]}
            eventHandlers={{
              click: (e) => {
                handleMouseClick(e);
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
