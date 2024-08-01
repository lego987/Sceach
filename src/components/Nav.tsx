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
          <li key={nav.id} className='text-red-500'>
            <Link href={nav.link} legacyBehavior>
              <a className='flex items-center p-2 hover:bg-gray-200'>
                <i className={`bi ${nav.icon} mr-2 text-xl`}></i>
                {nav.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

