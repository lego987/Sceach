'use client';

import React, { useState } from 'react';
import './header.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Nav from './Nav';
import Sci from './Sci';
import Image from 'next/image'; // Import Image component from next

export default function Header() {
    const [open, setOpen] = useState(false);

    const handleButtonClick = (e: React.MouseEvent | any) => {
        e.preventDefault();
        setOpen(!open);
    };

    return (
        <header id="header" className="header d-flex align-items-center fixed-top">
            <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
                <a href="/" className="logo d-flex align-items-center">
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={200} // Adjust the width and height as needed
                        height={80}
                    />
                </a>
                <Nav />
            </div>
        </header>
    );
}


