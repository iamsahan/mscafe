import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { servicesAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import {
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CalculatorIcon,
  CreditCardIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const BuyService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const fetchService = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesAPI.getById(id);
      setService(response.data.data);
    } catch (error) {
      console.error("Failed to fetch service:", error);
      setError("Service not found or unavailable.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageUrl = (service) => {
    if (!service) return null;
    const imageUrl = service.image_url || service.imageUrl;
    if (!imageUrl) return null;

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    const baseUrl = "http://148.230.87.141/api/v1";

    if (imageUrl.startsWith("/uploads/")) {
      return `${baseUrl}${imageUrl}`;
    }

    return `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case "tax_preparation":
        return DocumentTextIcon;
      case "financial_planning":
        return CreditCardIcon;
      case "consultation":
        return CalculatorIcon;
      case "business_advisory":
        return DocumentMagnifyingGlassIcon;
      default:
        return SparklesIcon;
    }
  };

  const handleBookNow = async () => {
    try {
      setIsBooking(true);

      // If service has a link, redirect to external booking page
      if (service.link) {
        window.open(service.link, "_blank");
        return;
      }

      // Here you would typically integrate with a booking/payment system
      // For now, we'll simulate the booking process

      console.log("Processing booking for service:", service.id);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, show success and redirect
      alert(
        "Booking successful! We will contact you shortly to confirm your appointment."
      );
      navigate("/dashboard/bookings"); // Redirect to user dashboard
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <LoadingSpinner size="w-12 h-12" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center pt-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Service Not Found
          </h2>

          <p className="text-secondary-600 mb-6">
            {error || 'The service you are looking for could not be found.'}

          </p>
          <Link
            to="/financial-help"
            className="btn-primary inline-flex items-center"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const ServiceIcon = getServiceIcon(
    service.serviceType || service.service_type
  );

  return (
    <div className="min-h-screen bg-secondary-50 pt-20">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/financial-help"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Services
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <ServiceIcon className="w-8 h-8 text-primary-600" />
                    </div>
                    {service.featured && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <StarIcon className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                    {service.name}
                  </h1>
                  <p className="text-lg text-secondary-600 leading-relaxed">
                    {service.shortDescription || service.short_description}
                  </p>
                </div>
              </div>

              {/* Service Image */}
              {!imageError && getImageUrl(service) && (
                <div className="mb-6">
                  <img
                    src={getImageUrl(service)}
                    alt={service.name}
                    onError={handleImageError}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Service Price & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <CurrencyDollarIcon className="w-8 h-8 text-primary-600 mr-4" />
                  <div>

                    <div className="text-2xl font-bold text-primary-900">${service.price}</div>
                    <div className="text-sm text-primary-700">Service Price</div>

                  </div>
                </div>
                <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <ClockIcon className="w-8 h-8 text-blue-600 mr-4" />
                  <div>

                    <div className="text-2xl font-bold text-blue-900">{service.durationMinutes || service.duration_minutes || 60} min</div>
                    <div className="text-sm text-blue-700">Duration</div>

                  </div>
                </div>
              </div>
            </motion.div>

            {/* Service Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-8"
            >
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                Service Details
              </h2>
              <div className="prose prose-lg">
                <p className="text-secondary-600 leading-relaxed">
                  {service.description}
                </p>
                {service.requirements && (
                  <div className="mt-6">

                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">Requirements</h3>
                    <p className="text-secondary-600">

                      {service.requirements}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1 ">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-20"
            >
              <div className="card p-6 space-y-6">
                {/* Service Price */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-secondary-900 mb-2">
                    ${service.price}
                  </div>

                  <div className="text-sm text-secondary-600">
                    {service.durationMinutes || service.duration_minutes || 60} minutes consultation

                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={handleBookNow}
                  disabled={isBooking}
                  className="w-full btn-primary flex items-center justify-center py-4 text-lg font-semibold bg-[#93268f]"
                >
                  {isBooking ? (
                    <>
                      <LoadingSpinner size="w-5 h-5" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CalendarDaysIcon className="w-5 h-5 mr-2" />
                      Book Service
                    </>
                  )}
                </button>

                {/* Service Features */}
                <div className="space-y-3 pt-4 border-t border-secondary-200">
                  <div className="flex items-center space-x-3 text-sm text-secondary-600">
                    <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                    <span>Professional service guarantee</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-secondary-600">
                    <ClockIcon className="w-5 h-5 text-blue-500" />
                    <span>Timely delivery</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-secondary-600">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-500" />
                    <span>Expert support</span>
                  </div>
                </div>

                {/* Contact Support */}
                <div className="pt-4 border-t border-secondary-200">
                  <p className="text-sm text-secondary-600 text-center">
                    Questions about this service?
                  </p>
                  <Link
                    to="/contact"
                    className="block text-center text-primary-600 hover:text-primary-700 font-medium text-sm mt-2"
                  >
                    Contact our experts
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyService;
