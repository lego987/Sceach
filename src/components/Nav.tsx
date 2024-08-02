import React from 'react';
import { navs } from '@/data/data';
import './nav.css';
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Nav() {
  return (
    <nav id="navbar" className="navbar">
      <ul>
        {navs.map(nav => (
          <li key={nav.id}>
            <Link href={nav.link} legacyBehavior>
              <a className='nav-link'>
                <i className={`bi ${nav.icon} icon-style`}></i>
                <span className='nav-text'>{nav.name}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
