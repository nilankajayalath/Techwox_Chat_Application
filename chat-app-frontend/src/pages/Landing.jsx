import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../images/landing hero image.png";
import featureImg from "../images/landing feature search image.png";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 shadow-lg">
        <h1 className="text-3xl font-bold tracking-wide">Chatme</h1>
        <div className="space-x-4">
          <Link to="/login">
            <button className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Register
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-center px-10 md:px-24 py-16 gap-10">
        <div className="md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Real-Time Chat. <span className="text-blue-400">Powered by AI.</span>
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Connect instantly with friends, colleagues, and communities using blazing fast, secure, and intelligent messaging.
          </p>
          <div className="space-x-4">
            <Link to="/register">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Get Started
              </button>
            </Link>
            <Link to="/login">
              <button className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition">
                Already have an account?
              </button>
            </Link>
          </div>
        </div>
        <img
          src={heroImg}
          alt="Chat Illustration"
          className="md:w-1/2 w-full rounded-xl shadow-xl"
        />
      </section>

      {/* Features Section */}
      <section className="bg-[#111827] py-16 px-8 md:px-24">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-semibold">Why Chatme?</h3>
          <p className="text-gray-400 mt-4">
            Smart chat experience with real-time delivery and AI-enhanced suggestions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <img
            src={featureImg}
            alt="AI Chat Features"
            className="w-full rounded-lg shadow-md"
          />
          <ul className="space-y-6 text-lg text-gray-300">
            <li>✅ Instant real-time messaging</li>
            <li>✅ Smart suggestions with AI assistance</li>
            <li>✅ Secure and encrypted conversations</li>
            <li>✅ Group and one-on-one chats</li>
            <li>✅ Easy login and registration</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm bg-[#0f172a]">
        © {new Date().getFullYear()} Chatme. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
