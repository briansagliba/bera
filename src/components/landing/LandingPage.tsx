import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("/background.jpg")` }}
      ></div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Helmet for SEO */}
      <Helmet>
        <title>Bilar Emergency Response Application</title>
        <meta
          name="description"
          content="An advanced emergency response system for Bilar municipality."
        />
      </Helmet>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-white text-center p-6">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in">
          Bilar Emergency Response
        </h1>
        <p className="text-lg md:text-2xl max-w-3xl mx-auto mb-6 animate-fade-in delay-200">
          A fast and efficient emergency response system designed to safeguard
          the community of Bilar.
        </p>

        {/* Call to Action Button */}
        <div className="mt-6 animate-fade-in delay-400">
          <Link to="/login">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white text-xl py-4 px-8 flex items-center gap-2"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative bg-gray-900 py-16 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Why Choose Bilar Emergency Response?
        </h2>
        <div className="container mx-auto grid gap-8 md:grid-cols-3 px-6">
          {/* Feature 1 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">24/7 Emergency Support</h3>
            <p className="text-sm mt-2">
              Our system ensures rapid response to emergencies at any time of
              the day.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Real-Time Tracking</h3>
            <p className="text-sm mt-2">
              Live maps allow responders to locate incidents with pinpoint
              accuracy.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">User-Friendly Interface</h3>
            <p className="text-sm mt-2">
              Easy-to-use platform for both responders and citizens.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/90 text-white py-6 text-center">
        <div className="container mx-auto px-6">
          <p className="text-sm">
            © {new Date().getFullYear()} Bilar Emergency Response. All rights
            reserved.
          </p>
          <p className="mt-1 text-sm">
            For immediate assistance, call the national emergency hotline:{" "}
            <span className="font-medium">911</span>
          </p>
          <div className="mt-3 flex justify-center gap-4">
            <Link to="/contact" className="underline text-sm">
              Contact Us
            </Link>
            <Link to="/privacy-policy" className="underline text-sm">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
