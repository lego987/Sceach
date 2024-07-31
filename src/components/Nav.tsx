import React from 'react';
import { navs } from '@/data/data';
import './nav.css';
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Nav() {
  return (
    <nav id="navbar" className="navbar">
        <ul>
            {navs.map(nav=> (
                <li key={nav.id}>
                    <Link href={nav.link}>
                        {nav.name =='Home' ? (
                            <i className="bi bi-house-door-fill"></i>
                            ) : (
                              nav.name
                        )}

                    </Link>
                </li>
                ))}
        </ul>
    </nav>            
  );
}
