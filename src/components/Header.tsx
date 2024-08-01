'use client';

import React, {useState} from 'react'
import './header.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Nav from './Nav'
import Sci from './Sci'

export default function Header() {
    const [open, setOpen] = useState(false);

    const handleFormOpen = (e: Event | any)=>{
        e.preventDefault();
        setOpen(!open);
    };

  return (
   <header 
    id="header" 
    className="header d-flex algin-items-center fixed-top"
    >
        <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
            <a href="/" className="logo d=flex align-items-center">
                {/* <img src="" alt="" /> */}


                <h1>Sce<span className='text-green-400 ' style={{color:"#66BB6A"}}>
                    a
                    </span>
                    ch</h1>
            </a>
            <Nav />
        </div>
   </header> 
  );
}
