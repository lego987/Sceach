'use client';

import React, { useState } from 'react';
import './header.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Nav from './Nav';
import Sci from './Sci';

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
                    <h1>
                        Sce<span className='text-green-400' style={{ color: "#66BB6A" }}>a</span>ch
                    </h1>
                </a>
                <Nav />
            </div>
        </header>
    );
}
