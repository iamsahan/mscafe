import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../images/logo.png'; 
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  HomeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  BookOpenIcon,
  InformationCircleIcon,
  PhoneIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const companyMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (companyMenuRef.current && !companyMenuRef.current.contains(event.target)) {
        setCompanyMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Financial Help', href: '/financial-help', icon: CurrencyDollarIcon },
    { name: 'Tax Professional', href: '/tax-professional', icon: DocumentTextIcon },
    { name: 'Buy Tradelines', href: '/priority-tradelines', icon: BookOpenIcon },
  ];

  const companyDropdown = [
    { name: 'About', href: '/about', icon: InformationCircleIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-2xl'
          : 'bg-gradient-to-b from-black/20 via-black/10 to-transparent backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className={`flex justify-between items-center transition-all duration-700 ${
          isScrolled ? 'h-16' : 'h-24'
        }`}>
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/" className="group">
              <img 
                src={logo}
                alt="MSG Services" 
                className={`transition-all duration-700 ease-out object-contain ${
                  isScrolled 
                    ? 'h-16 w-auto'
                    : 'h-20 w-auto'
                } group-hover:brightness-110 drop-shadow-lg`}
              />
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-all duration-300 flex items-center space-x-2 group ${
                    isScrolled
                      ? 'text-gray-700 hover:text-[#93268f]'
                      : 'text-white/95 hover:text-white'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                  <span className="text-sm">{item.name}</span>
                </motion.a>
              );
            })}

            {/* Company Dropdown */}
            <div className="relative" ref={companyMenuRef}>
              <motion.button
                onClick={() => setCompanyMenuOpen(!companyMenuOpen)}
                className={`font-medium transition-all duration-300 flex items-center space-x-2 group ${
                  isScrolled
                    ? 'text-gray-700 hover:text-[#93268f]'
                    : 'text-white/95 hover:text-white'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navigation.length * 0.1, duration: 0.6 }}
              >
                <BuildingOfficeIcon className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                <span className="text-sm">Company</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${companyMenuOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {companyMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-3 w-48 rounded-2xl shadow-2xl ring-1 ring-black/5 backdrop-blur-xl bg-white/95 overflow-hidden"
                  >
                    <div className="p-2">
                      {companyDropdown.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <motion.a
                            key={item.name}
                            href={item.href}
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:text-[#93268f] hover:bg-blue-50 rounded-xl transition-all duration-200"
                            onClick={() => setCompanyMenuOpen(false)}
                            whileHover={{ x: 4 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </motion.a>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Book Now Button */}
            <motion.a
              href="/financial-help"
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-500 relative overflow-hidden group ${
                isScrolled
                  ? 'bg-gradient-to-r from-[#93268f] to-[#93268a] text-white hover:from-[#842f81] hover:to-[#e256d6] shadow-xl hover:shadow-2xl'
                  : 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30 border-2 border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl'
              }`}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Book Now</span>
            </motion.a>

        
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-all duration-300 ${
                isScrolled
                  ? 'text-gray-700 hover:text-[#93268f]'
                  : 'text-white/95 hover:text-white'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </motion.div>
            </motion.button>

        
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="lg:hidden overflow-hidden bg-gray-100 border-t border-gray-200/50"
          >
            <div className="px-6 py-8 space-y-3">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-4 px-6 py-4 text-base font-medium text-gray-700 hover:text-[#93268f] transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="h-6 w-6" />
                    <span>{item.name}</span>
                  </motion.a>
                );
              })}

              {/* Mobile Company Section */}
              <div className="space-y-2">
                <div className="px-6 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</h3>
                </div>
                {companyDropdown.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-4 px-6 py-4 text-base font-medium text-gray-700 hover:text-[#93268f] transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navigation.length + index) * 0.1, duration: 0.4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="h-6 w-6" />
                      <span>{item.name}</span>
                    </motion.a>
                  );
                })}
              </div>
            
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

