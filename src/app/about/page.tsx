// src/app/about/page.tsx
"use client"; // Ensure this file is rendered as a client component

import React from "react";
import ImageCarousel from "@/components/ImageCarousel"; // Import the carousel component
import "./page.css"; // Import the CSS file for page styling

const About: React.FC = () => {
	return (
		<main className="container">
			<header>
				<h1>About Us</h1>
			</header>
			<section>
				<p className="text-black">
					Our team of Tomás, Aditya, and Rosheen joined the Patch Youth
					Accelerator to develop a tool that can help speed up the flagging of
					illegal hedge cutting and harm to bird nesting. We are passionate
					about environmental conservation and are working closely with national
					parks and wildlife services to make a meaningful impact.
				</p>
			</section>
			<div className="">
				<ImageCarousel />
			</div>
			<p>Version 1.01</p>
		</main>
	);
};

export default About;
