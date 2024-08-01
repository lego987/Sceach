// src/app/page.tsx

"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const HomePage = () => {
  return (
    <div>
      <Map />
    </div>
  );
};

export default HomePage;




