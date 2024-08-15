"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "./Map.css"; // Import the custom CSS file
const axios = require("axios");

// Fixing the issue with missing marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

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
			style: "bar",
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
			searchLabel: "Enter address",
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
	const [scanResults, setScanResults] = useState<string[]>([]); // Initialize as empty array
	const [isBoxVisible, setIsBoxVisible] = useState(false); // State to control floating box visibility
	const [loading, setLoading] = useState(false); // State for loading bar

	useEffect(() => {
		if (mapRef.current) {
			const mapInstance = mapRef.current;

			mapInstance.on("click", (event) => {
				const { latlng } = event;
				if (circle) {
					animateCircle(circle, latlng, radius);
				} else {
					const newCircle = L.circle(latlng, {
						color: "rgb(168, 117, 50",
						fillColor: "rgb(168, 117, 50)",
						fillOpacity: 0.2, // Translucent
						radius: 0, // Start with radius 0 for animation
					}).addTo(mapInstance);

					setCircle(newCircle);
					animateCircle(newCircle, latlng, radius);
				}
				setShowButtons(true); // Show the buttons when the map is clicked
			});

			return () => {
				mapInstance.off("click");
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
			return value * (1 - 1 / (value + 1)) * factor;
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

	useEffect(() => {
		setRadius(100);
	});

	const handleConfirm = () => {
		if (circle) {
			const { lat, lng } = circle.getLatLng();

			// Construct the URL with the required parameters
			// const url = `http://127.0.0.1:3000/submit_scan?x=${lat}&y=${lng}&radius=${radius}`;
			const url = `https://api.sceach.eu/submit_scan?x=${lat}&y=${lng}&radius=${radius}`;

			// Show the loading bar
			setLoading(true);

			// Send the GET request to the server
			axios
				.get(url)
				.then((response) => {
					let data = response.data.processed_images;
					let images = Object.values(data);
					// Make sure to handle cases where data.images might be undefined
					console.log("Server response:", data); // Log the response data
					try {
						setScanResults(images);
					} catch {
						setScanResults([]); // Fallback to an empty array
					}
					setConfirmationVisible(true);
					setTimeout(() => setConfirmationVisible(false), 3000);
					setIsBoxVisible(true); // Show the floating box after scan results come back

					// Hide the loading bar after 2 seconds
					setTimeout(() => setLoading(false), 2000);
				})
				.catch((error) => {
					console.error("Error submitting scan:", error);
					setScanResults([]); // Fallback in case of an error

					// Hide the loading bar if there's an error
					setLoading(false);
				});
		}
	};

	const handleCancel = () => {
		if (circle) {
			circle.remove(); // Remove the circle
			setCircle(null); // Clear the circle state
		}
		setShowButtons(false); // Hide the buttons after cancellation
		setIsBoxVisible(false); // Hide the floating box after cancellation
	};

	const toggleBoxVisibility = () => {
		setIsBoxVisible(!isBoxVisible); // Toggle floating box visibility
	};

	const handleExport = () => {
		scanResults.forEach((base64String, index) => {
			const link = document.createElement("a");
			link.href = `data:image/png;base64,${base64String[0]}`;
			link.download = index === 0 ? "before.png" : "after.png"; // Name the files accordingly
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link); // Clean up the link element
		});
	};

	return (
		<>
			<MapContainer
				style={{ height: "100vh", width: "100%" }}
				center={[51.87600278432267, -8.586070288915902]}
				zoom={13}
				zoomControl={false} // Disable default zoom control
				ref={mapRef}
				whenCreated={setMap}
			>
				<TileLayer
					url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
					attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
				/>
				<GeoSearch />
				<ZoomControl position="topright" />{" "}
				{/* Add zoom control to top right */}
			</MapContainer>
			<div className="radius-control-container">
				<label htmlFor="radius" className="radius-control-label">
					Scan Radius: {radius} meters
				</label>
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
			{loading && (
				<div className="loading-bar-container">
					<div className="loading-bar"></div>
				</div>
			)}
			{showButtons && (
				<div className="button-container">
					<button onClick={handleConfirm} className="confirm-button">
						Confirm Scan
					</button>
					<button onClick={handleCancel} className="cancel-button">
						Cancel
					</button>
				</div>
			)}
			{confirmationVisible && (
				<div className="confirmation-message">
					Scan coordinates submitted successfully!
				</div>
			)}
			<button onClick={toggleBoxVisibility} className="toggle-button">
				{isBoxVisible ? "Hide Results" : "Show Results"}
			</button>
			{isBoxVisible && (
				<div className="floating-box">
					<h3>Scan Results</h3>
					{scanResults.length > 0 ? (
						<>
							{scanResults.map((base64String, index) => {
								console.log(
									`Rendering image ${index + 1}:`
									// base64String.slice(0, 100)
								); // Log the start of the base64 string
								return (
									<div className="image-container" key={index}>
										<img
											src={`data:image/png;base64,${base64String}`}
											alt={`Scan result ${index + 1}`}
											style={{
												width: "100%",
												height: "auto",
												marginBottom: "0px",
											}}
											onError={(e) => {
												console.error("Error loading image:", e);
											}}
										/>
										<div className="image-label">
											{index === 0 ? "Before" : "After"}
										</div>
									</div>
								);
							})}
							<button onClick={handleExport} className="export-button">
								Export
							</button>{" "}
							{/* Add Export button */}
						</>
					) : (
						<p>No results available.</p>
					)}
				</div>
			)}
		</>
	);
};

export default MapWithRadius;
