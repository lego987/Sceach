'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import './Map.css'; // Import the custom CSS file

// Fixing the issue with missing marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon as unknown as string,
  shadowUrl: iconShadow as unknown as string,
});

L.Marker.prototype.options.icon = DefaultIcon;

const GeoSearch = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      marker: {
        icon: new L.Icon.Default(),
        draggable: false,
      },
      popupFormat: ({ query, result }) => result.label,
      maxMarkers: 1,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: 'Enter address',
      keepResult: true,
    });

    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
};

const MapWithRadius = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [circle, setCircle] = useState(null);
  const [radius, setRadius] = useState(500); // Initial radius in meters
  const [showButtons, setShowButtons] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  useEffect(() => {
    if (mapRef.current) {
      const mapInstance = mapRef.current;

      mapInstance.on('click', (event) => {
        const { latlng } = event;
        if (circle) {
          animateCircle(circle, latlng, radius);
        } else {
          const newCircle = L.circle(latlng, {
            color: 'rgb(59, 98, 1)',
            fillColor: 'rgb(59, 98, 1)',
            fillOpacity: 0.2, // Translucent
            radius: 0, // Start with radius 0 for animation
          }).addTo(mapInstance);

          setCircle(newCircle);
          animateCircle(newCircle, latlng, radius);
        }
        setShowButtons(true); // Show the buttons when the map is clicked
      });

      return () => {
        mapInstance.off('click');
      };
    }
  }, [mapRef.current, circle, radius]);

  const animateCircle = (circle, latlng, targetRadius) => {
    const duration = 100; // Animation duration in ms
    const frameRate = 60; // Frames per second
    const totalFrames = (duration / 1000) * frameRate;
    const increment = targetRadius / totalFrames;
    let currentRadius = 0;
    let frame = 0;

    const bounce = (value) => {
      const factor = 1.2; // Bounce factor
      return value * (1 - (1 / (value + 1))) * factor;
    };

    const animate = () => {
      if (frame < totalFrames) {
        currentRadius += increment;
        const bounceEffect = bounce(currentRadius / targetRadius);
        circle.setRadius(currentRadius * bounceEffect);
        frame++;
        requestAnimationFrame(animate);
      } else {
        circle.setRadius(targetRadius); // Ensure it reaches the exact target radius
      }
    };

    circle.setLatLng(latlng); // Ensure circle is at the clicked location
    requestAnimationFrame(animate);
  };

  const handleRadiusChange = (event) => {
    const newRadius = event.target.value;
    setRadius(newRadius);
    if (circle) {
      animateCircle(circle, circle.getLatLng(), newRadius);
    }
  };

  const handleConfirm = () => {
    if (circle) {
      const { lat, lng } = circle.getLatLng();
      
      // Construct the URL with the required parameters
      const url = `https://api.sceach.eu:8443/submit_scan?x=${lat}&y=${lng}&radius=${radius}`;

      // Send the GET request to the server
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setConfirmationVisible(true);
          setTimeout(() => setConfirmationVisible(false), 3000);
        })
        .catch(error => console.error('Error submitting scan:', error));
    }
  };

  const handleCancel = () => {
    if (circle) {
      circle.remove(); // Remove the circle
      setCircle(null); // Clear the circle state
    }
    setShowButtons(false); // Hide the buttons after cancellation
  };

  return (
    <>
      <MapContainer
        style={{ height: '100vh', width: '100%' }}
        center={[53.3498, -6.2603]}
        zoom={13}
        zoomControl={false} // Disable default zoom control
        ref={mapRef}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoSearch />
        <ZoomControl position="topright" /> {/* Add zoom control to top right */}
      </MapContainer>
      <div className="radius-control-container">
        <label htmlFor="radius" className="radius-control-label">Scan Radius: {radius} meters</label>
        <input
          type="range"
          id="radius"
          name="radius"
          min="100"
          max="2000"
          value={radius}
          onChange={handleRadiusChange}
          className="radius-control-slider"
        />
      </div>
      {showButtons && (
        <div className="button-container">
          <button onClick={handleConfirm} className="confirm-button">Confirm Scan</button>
          <button onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
      )}
      {confirmationVisible && (
        <div className="confirmation-message">Scan coordinates submitted successfully!</div>
      )}
    </>
  );
};

export default MapWithRadius;
