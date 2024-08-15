"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type TableColumn = {
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

const RecentViolationsPage = () => {
	const [data, setData] = useState<TableColumn[]>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("../api/fetchdata");
				if (!response.ok) {
					throw new Error("Failed to fetch data");
				}
				const fetchedData: TableColumn[] = await response.json();
				setData(fetchedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();

		// Optionally, you can also set up an interval to fetch new data periodically
		// const intervalId = setInterval(fetchData, 10000); // Fetch new data every 10 seconds
		// return () => clearInterval(intervalId); // Cleanup interval on component unmount
	}, []);

	const handleStatusChange = async (index: number, newStatus: string) => {
		const updatedData = [...data];
		updatedData[index].status = newStatus;
		setData(updatedData);

		try {
			const rowId = data[index].id;
			await fetch("/api/updateStatus", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: rowId, status: newStatus }),
			});
		} catch (error) {
			console.error("Error updating status:", error);
		}
	};

	const handleViewDetails = (id: number) => {
		router.push(`/recentviolations/${id}`);
	};

	return (
		<div className={styles.container}>
			<h2>Recent Violations</h2>
			<div className={styles.tableContainer}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th className={styles.tableHeader}>ID</th>
							<th className={styles.tableHeader}>Description</th>
							<th className={styles.tableHeader}>County</th>
							<th className={styles.tableHeader}>Status</th>
							<th className={styles.tableHeader}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{data.map((row, index) => (
							<tr
								key={row.id}
								className={`${styles.tableRow} ${
									index % 2 === 0 ? styles.tableRowEven : ""
								}`}
							>
								<td className={styles.tableCell}>{row.id}</td>
								<td className={styles.tableCell}>{row.description}</td>
								<td className={styles.tableCell}>{row.county}</td>
								<td className={styles.statusCell}>
									<select
										value={row.status}
										onChange={(e) => handleStatusChange(index, e.target.value)}
										className={styles.statusDropdown}
									>
										<option value="Pending">Pending</option>
										<option value="Resolved">Resolved</option>
									</select>
								</td>
								<td className={styles.tableCell}>
									<button onClick={() => handleViewDetails(row.id)}>
										View Details
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default RecentViolationsPage;
