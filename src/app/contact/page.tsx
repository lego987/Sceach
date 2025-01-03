"use client"; // Ensure this file is rendered as a client component

import React from "react";
import "./page.css"; // Import the CSS file for page styling

const Contact: React.FC = () => {
	return (
		<main className="container">
			<header>
				<h1>Contact Us</h1>
			</header>
			<section>
				<p className="text-black">
					Have questions or want to get in touch? Fill out the form below, and
					we will get back to you as soon as possible.
				</p>
			</section>
			<form action="https://formspree.io/f/xwppwvdw" method="POST">
				<label htmlFor="name">Name</label>
				<input
					type="text"
					id="name"
					name="name"
					placeholder="Your Name"
					required
				/>

				<label htmlFor="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					placeholder="Your Email"
					required
				/>

				<label htmlFor="message">Message</label>
				<textarea
					id="message"
					name="message"
					rows={5}
					placeholder="Your Message"
					required
				></textarea>

				<button type="submit">Send</button>
			</form>
		</main>
	);
};

export default Contact;
