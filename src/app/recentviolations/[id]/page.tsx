"use client"; // Add this directive to mark the file as a client component

import React, { useState, useEffect, use } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./page.module.css";

// Define the ViolationDetails type
type ViolationDetails = {
	id: number;
	description: string;
	latitude: number;
	longitude: number;
	county: string;
	severity: string;
	status: string;
	before_img: string;
	after_img: string;
};

// Function to calculate the square size based on zoom level
const getSquareSizeForZoom = (zoom: number): number => {
	const baseZoomLevel = 18; // The zoom level for which you want the base size
	const baseSize = 100; // Base size in pixels for zoom level 17

	// The size should decrease as zoom level decreases
	// We use an exponential scaling factor to adjust the size appropriately
	const scaleFactor = Math.pow(2, baseZoomLevel - zoom);
	return baseSize * scaleFactor;
};

// TileSquareMarker Component
const TileSquareMarker = ({ position }: { position: L.LatLngExpression }) => {
	const map = useMap();
	const [squareSize, setSquareSize] = useState<number>(
		getSquareSizeForZoom(map.getZoom())
	);

	useEffect(() => {
		const handleZoomEnd = () => {
			const zoom = map.getZoom();
			setSquareSize(getSquareSizeForZoom(zoom));
		};

		handleZoomEnd(); // Set initial size
		map.on("zoomend", handleZoomEnd);

		return () => {
			map.off("zoomend", handleZoomEnd);
		};
	}, [map]);

	return (
		<Marker
			position={position}
			icon={L.divIcon({
				className: styles.customSquare,
				html: `<div style="width: ${squareSize}px; height: ${squareSize}px; background: rgba(205, 162, 8, 0.3);"></div>`,
				iconSize: [squareSize, squareSize],
				iconAnchor: [squareSize / 2, squareSize / 2],
			})}
		/>
	);
};

// ViolationDetailPage Component
const ViolationDetailPage = ({ params }: { params: { id: string } }) => {
	const [violation, setViolation] = useState<ViolationDetails | null>(null);
	const [status, setStatus] = useState<string>("Pending"); // State for dropdown
	const [before_img, setBefore_img] = useState(null);
	const [after_img, setafter_img] = useState(null);
	const { id } = params;
	console.log(id);

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				const response = await fetch(`/api/fetchdata?id=${id}`);
				if (!response.ok) {
					throw new Error("Failed to fetch violation details");
				}
				const data = await response.json();
				setViolation(data);
				setStatus(data.status);
			} catch (error) {
				console.error("Error fetching details:", error);
			}
		};
		fetchDetails();
	}, [id]);

	useEffect(() => {
		console.log(violation);
	}, [violation]);

	const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setStatus(event.target.value);
	};

	if (!violation) return <div>Loading...</div>;

	// Define bounds for a 2km by 2km area centered on the violation
	const bounds = L.latLngBounds(
		[violation.latitude - 0.009, violation.longitude - 0.009],
		[violation.latitude + 0.009, violation.longitude + 0.009]
	);

	return (
		<div className={styles.container}>
			<div className={styles.mapContainer}>
				<MapContainer
					center={[violation.latitude, violation.longitude]}
					zoom={25}
					className={styles.map}
					scrollWheelZoom={false} // Disable scroll wheel zoom
					zoomControl={false} // Disable zoom control buttons
					doubleClickZoom={false} // Disable double click zoom
					dragging={true} // Enable panning
					boxZoom={false} // Disable box zoom
					keyboard={false} // Disable keyboard navigation
					touchZoom={false} // Disable touch zoom
					style={{ height: "100vh", width: "100%" }}
					maxBounds={bounds} // Restrict the map panning area to the bounds
					maxBoundsViscosity={1.0} // Prevent panning outside of the bounds
				>
					<TileLayer
						url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
						attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
					/>
					<TileSquareMarker
						position={[violation.latitude, violation.longitude]}
					/>
				</MapContainer>
			</div>

			<div className={styles.content}>
				<div className={styles.violationBox}>
					<h1 className={styles.title}>Violation Details</h1>
				</div>
				<div className={styles.images}>
					<div className={styles.imageContainer}>
						<img
							src={"data:image/png;base64," + violation.after_img ?? ""}
							alt="Before"
							className={styles.image}
						/>
						<div className={styles.imageLabel}>Before</div>
					</div>
					<div className={styles.imageContainer}>
						<img
							src={"data:image/png;base64," + violation.before_img ?? ""}
							alt="After"
							className={styles.image}
						/>
						<div className={styles.imageLabel}>After</div>
					</div>
				</div>

				<div className={styles.lightBlueContainer}>
					<div className={styles.detailItem}>
						<span className={styles.detailLabel}>ID:</span>
						<span className={styles.detailValue}>{violation.id}</span>
					</div>
					<div className={styles.detailItem}>
						<span className={styles.detailLabel}>Description:</span>
						<span className={styles.detailValue}>{violation.description}</span>
					</div>
				</div>

				<div className={styles.lightBlueContainer}>
					<div className={styles.detailItem}>
						<span className={styles.detailLabel}>Latitude:</span>
						<span className={styles.detailValue}>{violation.latitude}</span>
					</div>
					<div className={styles.detailItem}>
						<span className={styles.detailLabel}>Longitude:</span>
						<span className={styles.detailValue}>{violation.longitude}</span>
					</div>
					<div className={styles.detailItem}>
						<span className={styles.detailLabel}>County:</span>
						<span className={styles.detailValue}>{violation.county}</span>
					</div>
					<div className={styles.detailItem}>
						<span className={styles.detailLabel}>Severity:</span>
						<span className={styles.detailValue}>{violation.severity} %</span>
					</div>
					<div className={styles.detailItem}>
						<span className={styles.detailLabel}>Status:</span>
						<span className={styles.detailValue}>
							<select
								value={status}
								onChange={handleStatusChange}
								className={styles.statusDropdown}
							>
								<option value="Pending">Pending</option>
								<option value="Resolved">Resolved</option>
							</select>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViolationDetailPage;
