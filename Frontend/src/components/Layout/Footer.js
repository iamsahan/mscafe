import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import {
  FacebookIcon,
  TwitterIcon,
  LinkedInIcon,
  InstagramIcon,
} from '../UI/SocialIcons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={logo}
                alt="MSG Services" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted partner for financial services and tax education. 
              Empowering individuals and businesses with expert guidance and 
              professional development opportunities.
            </p>
            <div className="flex space-x-4">
              <button 
                type="button"
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
                onClick={() => window.open('https://facebook.com', '_blank')}
                aria-label="Visit our Facebook page"
              >
                <FacebookIcon className="w-5 h-5" />
              </button>
              <button 
                type="button"
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
                onClick={() => window.open('https://twitter.com', '_blank')}
                aria-label="Visit our Twitter page"
              >
                <TwitterIcon className="w-5 h-5" />
              </button>
              <button 
                type="button"
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
                onClick={() => window.open('https://linkedin.com', '_blank')}
                aria-label="Visit our LinkedIn page"
              >
                <LinkedInIcon className="w-5 h-5" />
              </button>
              <button 
                type="button"
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
                onClick={() => window.open('https://instagram.com', '_blank')}
                aria-label="Visit our Instagram page"
              >
                <InstagramIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-sm hover:text-primary-400 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/financial-help" 
                  className="text-sm hover:text-primary-400 transition-colors duration-200"
                >
                  Financial Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/tax-professional" 
                  className="text-sm hover:text-primary-400 transition-colors duration-200"
                >
                  Tax Education
                </Link>
              </li>
              <li>
                <Link 
                  to="/testimonials" 
                  className="text-sm hover:text-primary-400 transition-colors duration-200"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link 
                  to="/resources" 
                  className="text-sm hover:text-primary-400 transition-colors duration-200"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-sm">Tax Filing & Preparation</li>
              <li className="text-sm">Credit Repair Services</li>
              <li className="text-sm">Notary Services</li>
              <li className="text-sm">Financial Consulting</li>
              <li className="text-sm">Tax Professional Courses</li>
              <li className="text-sm">Continuing Education</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-sm">
                  900 Pio Nono Ave<br />
                  Macon, GA 31204
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-sm">1 (478) 999-7456</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-sm">support@moneysolutioncafe.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div className="text-sm">
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 pt-8 border-t border-secondary-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white font-semibold mb-2">Stay Updated</h3>
              <p className="text-sm">Subscribe to our newsletter for the latest updates and tips.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-secondary-800 border border-secondary-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-secondary-400"
              />
              <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-r-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-secondary-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-secondary-400 mb-4 md:mb-0">
            © {currentYear} SSE Services. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link 
              to="/privacy-policy" 
              className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-of-service" 
              className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link 
              to="/contact" 
              className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
