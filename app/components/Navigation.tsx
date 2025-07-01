// app/components/Navigation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <a href={href} className="block text-2xl font-semibold text-gray-300 hover:text-white py-3">
    {children}
  </a>
);

const MobileMenu = ({ isOpen, closeMenu }: { isOpen: boolean, closeMenu: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-lg"
        onClick={closeMenu}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-0 right-0 h-full w-full max-w-xs bg-[var(--surface)] p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col h-full justify-center items-center space-y-4">
            <NavLink href="/gaming">Gaming</NavLink>
            <NavLink href="/auto">Auto</NavLink>
            <NavLink href="/#cooking">Cooking</NavLink>
            <NavLink href="/#coding">Coding Projects</NavLink>
            <NavLink href="/links">Lets Connect</NavLink>
          </nav>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const HamburgerButton = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => (
  <button onClick={toggle} className="relative z-50 md:hidden w-8 h-8 text-white">
    <span className={`block absolute h-0.5 w-full bg-current transform transition duration-500 ease-in-out ${isOpen ? 'rotate-45' : '-translate-y-2'}`}></span>
    <span className={`block absolute h-0.5 w-full bg-current transform transition duration-500 ease-in-out ${isOpen ? 'opacity-0' : ''}`}></span>
    <span className={`block absolute h-0.5 w-full bg-current transform transition duration-500 ease-in-out ${isOpen ? '-rotate-45' : 'translate-y-2'}`}></span>
  </button>
);

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''
        }`}
      >
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <motion.a 
            href="/"
            whileHover={{ scale: 1.05 }}
            className="z-50"
          >
            <Image
              src="/media/yzRobo_Logo_Helmet_No_Background.png"
              alt="yzRobo Logo"
              width={75}
              height={35}
              priority
            />
          </motion.a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a href="/gaming" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm tracking-wide" whileHover={{ y: -2 }}>Gaming</motion.a>
            <motion.a href="/auto" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm tracking-wide" whileHover={{ y: -2 }}>Automotive</motion.a>
            <motion.a href="/#cooking" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm tracking-wide" whileHover={{ y: -2 }}>Cooking</motion.a>
            <motion.a href="/#projects" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm tracking-wide" whileHover={{ y: -2 }}>Coding Projects</motion.a>
            <motion.a
              href="/links"
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative px-6 py-2 bg-black/20 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm group-hover:border-white/50 transition-colors">
                Lets Connect
              </div>
            </motion.a>
          </div>

          {/* Mobile Hamburger Button */}
          <HamburgerButton isOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
        </div>
      </motion.nav>

      {/* Mobile Menu Panel */}
      <MobileMenu isOpen={isMenuOpen} closeMenu={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Navigation;