// src/components/ImageCarousel.tsx
'use client'; // Mark this as a client component

import React, { useEffect, useState } from 'react';
import './ImageCarousel.css'; // Import the CSS file for carousel styling

const images = [
  '/images/image1.jpg',
  '/images/image2.jpg',
  '/images/image3.jpg',
  // Add more image paths
];

const ImageCarousel: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="image-carousel">
      <img src={images[currentImage]} alt="Carousel" />
    </div>
  );
};

export default ImageCarousel;
