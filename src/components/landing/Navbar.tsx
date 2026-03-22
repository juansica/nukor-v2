'use client'

import { useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { label: 'Producto', href: '#producto' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Precios', href: '#precios' },
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between h-[72px] px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-heading font-bold text-xl text-gray-950 tracking-tight"
        >
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black bg-indigo-600 text-white shadow-sm">
            N
          </span>
          Nukor
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-gray-600 hover:text-gray-950 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-[15px] font-medium text-gray-600 hover:text-gray-950 transition-colors duration-200"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="bg-indigo-600 text-white text-[15px] font-medium px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Empieza ahora
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-text-secondary hover:text-text-primary p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white pb-6 px-6 shadow-lg">
          <div className="flex flex-col gap-4 pt-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-gray-600 hover:text-gray-950 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-gray-200 my-2" />
            <Link
              href="/sign-in"
              className="text-[15px] font-medium text-gray-600 hover:text-gray-950 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="bg-indigo-600 text-white text-[15px] font-medium px-6 py-3 mt-2 rounded-full text-center hover:bg-indigo-700 shadow-sm"
              onClick={() => setMenuOpen(false)}
            >
              Empieza ahora
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
