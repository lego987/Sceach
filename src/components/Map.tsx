'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import './Map.css'; // Import the custom CSS file
const axios = require('axios')

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
  const mapRef = useRef<L.Map | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [circle, setCircle] = useState<L.Circle | null>(null);
  const [radius, setRadius] = useState(500); // Initial radius in meters
  const [showButtons, setShowButtons] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [scanResults, setScanResults] = useState<string[]>([]);
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const lineRefs = useRef<HTMLDivElement[]>([]);
  const floatingBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const mapInstance = mapRef.current;

      mapInstance.on('click', (event) => {
        const { latlng } = event;
        if (circle) {
          animateCircle(circle, latlng, radius);
        } else {
          const newCircle = L.circle(latlng, {
            color: 'rgb(168, 117, 50',
            fillColor: 'rgb(168, 117, 50)',
            fillOpacity: 0.2,
            radius: 0,
          }).addTo(mapInstance);

          setCircle(newCircle);
          animateCircle(newCircle, latlng, radius);
        }
        setShowButtons(true);
      });

      return () => {
        mapInstance.off('click');
      };
    }
  }, [mapRef.current, circle, radius]);

  const animateCircle = (circle, latlng, targetRadius) => {
    const duration = 100;
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
    const increment = targetRadius / totalFrames;
    let currentRadius = 0;
    let frame = 0;

    const bounce = (value) => {
      const factor = 1.2;
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
        circle.setRadius(targetRadius);
      }
    };

    circle.setLatLng(latlng);
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

      const url = `https://api.sceach.eu:8443/submit_scan?x=${lat}&y=${lng}&radius=${radius}`;

      axios.get(url)
        .then(response => {
          let data = response.data.processed_images;
          let images = Object.values(data);
          try {
            setScanResults(images); 
          } catch {
            setScanResults([]);
          }
          setConfirmationVisible(true);
          setTimeout(() => setConfirmationVisible(false), 3000);
          setIsBoxVisible(true);
        })
        .catch(error => {
          console.error('Error submitting scan:', error);
          setScanResults([]);
        });
    }
  };

  const handleCancel = () => {
    if (circle) {
      circle.remove();
      setCircle(null);
    }
    setShowButtons(false);
  };

  const toggleBoxVisibility = () => {
    setIsBoxVisible(!isBoxVisible);
  };

  useEffect(() => {
    if (isBoxVisible) {
      createLines();
      window.addEventListener('resize', updateLines);
      return () => window.removeEventListener('resize', updateLines);
    }
  }, [isBoxVisible, circle, map]);

  return (
    <>
      <MapContainer
        style={{ height: '100vh', width: '100%' }}
        center={[53.3498, -6.2603]}
        zoom={13}
        zoomControl={false}
        ref={mapRef}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
        />
        <GeoSearch />
        <ZoomControl position="topright" />
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
      <button onClick={toggleBoxVisibility} className="toggle-button">
        {isBoxVisible ? 'Hide Results' : 'Show Results'}
      </button>
      {isBoxVisible && (
        <div className="floating-box" ref={floatingBoxRef}>
          <h3>Scan Results</h3>
          {scanResults.length > 0 ? (
            scanResults.map((base64String, index) => {
              return (
                <img 
                  key={index}
                  src={`data:image/png;base64,${base64String}`} 
                  alt={`Scan result ${index + 1}`} 
                  style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                  onError={(e) => {
                    console.error('Error loading image:', e);
                  }}
                />
              );
            })
          ) : (
            <p>No results available.</p>
          )}
        </div>
      )}
    </>
  );
};

const updateLines = () => {
  const floatingBox = floatingBoxRef.current;
  if (!floatingBox || !circle || !map) return;

  const boxRect = floatingBox.getBoundingClientRect();
  const circleLatLng = circle.getLatLng();
  const circlePoint = map.latLngToContainerPoint(circleLatLng);

  const lines = lineRefs.current;
  if (lines.length === 0) {
    for (let i = 0; i < 2; i++) {
      const line = document.createElement('div');
      line.className = 'connection-line';
      document.body.appendChild(line);
      lines.push(line);
    }
  }

  const boxCorners = [
    { x: boxRect.left, y: boxRect.top },
    { x: boxRect.left, y: boxRect.bottom },
  ];

  boxCorners.forEach((corner, index) => {
    const dx = circlePoint.x - corner.x;
    const dy = circlePoint.y - corner.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    lines[index].style.width = `${length}px`;
    lines[index].style.transform = `rotate(${angle}deg)`;
    lines[index].style.top = `${corner.y}px`;
    lines[index].style.left = `${corner.x}px`;
  });
};

export default MapWithRadius;
