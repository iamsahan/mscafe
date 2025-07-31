import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  AcademicCapIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  HeartIcon,
  LightBulbIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { number: '5000+', label: 'Happy Clients', icon: UserGroupIcon },
    { number: '15+', label: 'Years Experience', icon: ClockIcon },
    { number: '98%', label: 'Success Rate', icon: TrophyIcon },
    { number: '500+', label: 'Professionals Trained', icon: AcademicCapIcon },
  ];

  const values = [
    {
      icon: HeartIcon,
      title: 'Client-Centered Approach',
      description: 'We put our clients at the heart of everything we do, ensuring personalized service that meets your unique needs.',
      color: 'text-red-500'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation & Excellence',
      description: 'We continuously innovate our services and maintain the highest standards of professional excellence.',
      color: 'text-yellow-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Trust & Integrity',
      description: 'Built on a foundation of trust, we maintain complete transparency and integrity in all our operations.',
      color: 'text-green-500'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Perspective',
      description: 'We stay current with global financial trends and regulations to provide you with comprehensive guidance.',
      color: 'text-blue-500'
    }
  ];

  const services = [
    {
      title: 'Tax Education & Training',
      description: 'Comprehensive courses designed to help you become a certified tax professional with ongoing support.',
      features: ['IRS Approved Courses', 'Hands-on Training', 'Certification Support', 'Continuing Education']
    },
    {
      title: 'Financial Advisory Services',
      description: 'Expert financial guidance for individuals and businesses to achieve their financial goals.',
      features: ['Personal Finance Planning', 'Business Consulting', 'Investment Guidance', 'Risk Management']
    },
    {
      title: 'Professional Development',
      description: 'Career advancement programs and professional development opportunities in the financial sector.',
      features: ['Career Coaching', 'Skills Assessment', 'Network Building', 'Industry Insights']
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
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Empowering Your
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Financial Future
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your trusted partner for comprehensive tax education, professional financial services, 
              and career development opportunities that transform lives and businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Get Started Today
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
              
              <Link
                to="/tax-professional"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
              >
                Explore Courses
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary-50 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center group"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 bg-primary-600 text-white rounded-2xl group-hover:bg-[#93268f] transition-colors duration-300">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-secondary-600 dark:text-secondary-300 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-white mb-6">
                Our Mission & Vision
              </h2>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-300 mb-3">
                    🎯 Our Mission
                  </h3>
                  <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                    To empower individuals and businesses with comprehensive tax education and professional 
                    financial services, helping them achieve financial success through expert guidance and 
                    innovative solutions.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-3">
                    🚀 Our Vision
                  </h3>
                  <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                    To be the leading provider of tax education and financial services, recognized for 
                    excellence, innovation, and the positive impact we create in our clients' lives 
                    and careers.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-600 to-[#93268f] rounded-3xl p-8 text-white">
                <div className="flex items-center mb-6">
                  <TrophyIcon className="w-12 h-12 text-yellow-400 mr-4" />
                  <div>
                    <h3 className="text-2xl font-bold">Why Choose MSG Services?</h3>
                    <p className="text-primary-100">Excellence in every service</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    'Expert-led training programs',
                    'Industry-recognized certifications',
                    'Personalized financial guidance',
                    'Ongoing professional support',
                    'Latest tax law updates',
                    'Career advancement opportunities'
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-primary-100">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-secondary-50 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our commitment to excellence.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white dark:bg-secondary-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className={`inline-flex p-4 rounded-2xl ${value.color} bg-opacity-10 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-white mb-6">
              What We Offer
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
              Comprehensive solutions designed to meet your financial education and professional development needs.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white dark:bg-secondary-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary-100 dark:border-secondary-700"
              >
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <StarIcon className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                      <span className="text-secondary-700 dark:text-secondary-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-[#93268f] to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Join thousands of professionals who have advanced their careers with MSG Services. 
              Start your journey today with expert guidance and comprehensive support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <UserGroupIcon className="mr-2 w-5 h-5" />
                Contact Us Today
              </Link>
              
              <Link
                to="/tax-professional"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
              >
                <AcademicCapIcon className="mr-2 w-5 h-5" />
                View Our Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
