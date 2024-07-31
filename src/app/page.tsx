// src/app/page.tsx

"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to My Website</h1>
      <Map />
    </div>
  );
};

export default HomePage;




