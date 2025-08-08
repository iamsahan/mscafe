import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const Contact = () => {

  const contactInfo = [
    {
      icon: PhoneIcon,
      label: 'Phone',
      value: '(478) 999-7456',
      href: 'tel:+14789997456',
      description: 'Call us for immediate assistance',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      icon: EnvelopeIcon,
      label: 'Email',
      value: 'support@moneysolutioncafe.com',
      href: 'mailto:support@moneysolutioncafe.com',
      description: 'Send us a detailed message',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      icon: MapPinIcon,
      label: 'Address',
      value: '900 Pio Nono Ave\nMacon, GA 31204',
      href: 'https://maps.google.com/?q=900+Pio+Nono+Ave+Macon+GA+31204',
      description: 'Visit our office location',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    }
  ];

  const supportOptions = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      available: 'Online now',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: CalendarDaysIcon,
      title: 'Schedule Meeting',
      description: 'Book a consultation with our experts',
      available: 'Available slots',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: UserGroupIcon,
      title: 'Team Support',
      description: 'Connect with our dedicated support team',
      available: '24/7 Support',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-[#93268f] to-purple-900 py-24 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent"></div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-6"
            >
              <EnvelopeIcon className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Get In{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
              Ready to transform your financial future? Our expert team is here to provide 
              personalized guidance and professional support every step of the way.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <ClockIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-white/90">24-hour response time</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <UserGroupIcon className="w-5 h-5 text-green-400" />
                <span className="text-white/90">Expert consultants</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative -mt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Support Options */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          >
            {supportOptions.map((option, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                     style={{background: `linear-gradient(135deg, #10b981, #059669)`}}></div>
                <div className="relative bg-white dark:bg-secondary-800 p-8 rounded-2xl shadow-xl border border-secondary-100 dark:border-secondary-700 hover:shadow-2xl transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${option.color} mb-6`}>
                    <option.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-3">
                    {option.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-4 leading-relaxed">
                    {option.description}
                  </p>
                  <div className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    {option.available}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="inline-block p-3 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl mb-6"
                >
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold text-secondary-900 dark:text-white mb-4">
                  Send Us a Message
                </h2>
                <p className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed">
                  Fill out the form below and we'll get back to you within 24 hours. 
                  Our team is ready to help you achieve your financial goals.
                </p>
              </div>

              {/* Embedded Contact Form */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-600/10 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white dark:bg-secondary-800 p-8 rounded-3xl shadow-2xl border border-secondary-100 dark:border-secondary-700">
                  <div className="w-full" style={{ height: '882px' }}>
                    <iframe
                      src="https://api.leadconnectorhq.com/widget/form/TTqBTsHvipiLYIR0a28A"
                      style={{
                        width: '100%',
                        height: '882px',
                        border: 'none',
                        borderRadius: '12px'
                      }}
                      title="MSC CONTACT US - form"
                      loading="lazy"
                      onError={(e) => console.warn('Iframe loading error:', e)}
                      onLoad={() => console.log('Iframe loaded successfully')}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Info Header */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="inline-block p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mb-6"
                >
                  <PhoneIcon className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold text-secondary-900 dark:text-white mb-4">
                  Contact Information
                </h2>
                <p className="text-lg text-secondary-600 dark:text-secondary-400">
                  Multiple ways to reach our expert team
                </p>
              </div>

              {/* Contact Info Cards */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="space-y-6"
              >
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="block group"
                  >
                    <div className="relative overflow-hidden bg-white dark:bg-secondary-800 p-8 rounded-2xl shadow-lg border border-secondary-100 dark:border-secondary-700 hover:shadow-2xl transition-all duration-300">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-purple-600"></div>
                      <div className="flex items-start space-x-6">
                        <div className={`p-4 rounded-2xl ${item.color} transition-all duration-300 group-hover:scale-110`}>
                          <item.icon className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {item.label}
                          </h3>
                          <p className="text-lg font-medium text-secondary-700 dark:text-secondary-300 mb-2 whitespace-pre-line">
                            {item.value}
                          </p>
                          <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                            {item.description}
                          </p>
                          <div className="flex items-center mt-3 text-primary-600 dark:text-primary-400 group-hover:translate-x-2 transition-transform">
                            <span className="text-sm font-medium">Get in touch</span>
                            <ArrowRightIcon className="ml-2 w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>

             

              {/* Interactive Map */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-600/10 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white dark:bg-secondary-800 p-8 rounded-3xl shadow-xl border border-secondary-100 dark:border-secondary-700">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl">
                      <MapPinIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
                        Our Location
                      </h3>
                      <p className="text-secondary-600 dark:text-secondary-400">
                        Visit us in person
                      </p>
                    </div>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-700 dark:to-secondary-800 rounded-2xl overflow-hidden relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3352.2491841860997!2d-83.66474862487563!3d32.83965338083459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f3fea4bce97a9f%3A0xd608d9a7fde10aec!2sMoney%20Solution%20Cafe!5e0!3m2!1sen!2slk!4v1753806816844!5m2!1sen!2slk"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full rounded-2xl"
                      title="Money Solution Cafe Location Map"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Support Section */}
      <section className="relative py-24 bg-gradient-to-br from-secondary-50 via-white to-secondary-50 dark:from-secondary-800 dark:via-secondary-900 dark:to-secondary-800 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block p-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-3xl mb-8"
            >
              <UserGroupIcon className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Our Support
              </span>
            </h2>
            
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto leading-relaxed">
              Experience unparalleled customer service with multiple communication channels 
              designed to meet your unique needs and preferences.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: PhoneIcon,
                title: 'Phone Support',
                description: 'Direct access to our expert consultants during business hours for immediate assistance and urgent matters.',
                features: ['Immediate response', 'Expert consultants', 'Business hours availability'],
                gradient: 'from-green-500 to-emerald-600'
              },
              {
                icon: EnvelopeIcon,
                title: 'Email Response',
                description: 'Comprehensive written responses within 24 hours for detailed inquiries and documentation.',
                features: ['24-hour response', 'Detailed answers', 'Written documentation'],
                gradient: 'from-blue-500 to-cyan-600'
              },
              {
                icon: MapPinIcon,
                title: 'In-Person Meeting',
                description: 'Face-to-face consultations at our modern office for complex financial planning and personal guidance.',
                features: ['Personal consultation', 'Modern facilities', 'Flexible scheduling'],
                gradient: 'from-purple-500 to-pink-600'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="relative h-full">
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl blur-xl`}></div>
                  <div className="relative bg-white dark:bg-secondary-800 p-8 rounded-3xl shadow-xl border border-secondary-100 dark:border-secondary-700 h-full hover:shadow-2xl transition-all duration-300">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-secondary-600 dark:text-secondary-400 mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <ul className="space-y-3">
                      {item.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm font-medium text-secondary-700 dark:text-secondary-300">
                          <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full mr-3 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6 pt-6 border-t border-secondary-100 dark:border-secondary-700">
                      <div className="flex items-center text-primary-600 dark:text-primary-400 group-hover:translate-x-2 transition-transform">
                        <span className="text-sm font-semibold">Get Started</span>
                        <ArrowRightIcon className="ml-2 w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          

        
        </div>
      </section>
    </div>
  );
};



export default Contact;
