import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, phone, image } = location.state || {};
  const [showUserInfo, setShowUserInfo] = useState(false);

  useEffect(() => {
    if (!phone) {
      navigate('/');
    }

    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, [phone, navigate]);

  const handleLogout = () => {
    navigate('/');
  };

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  return (
    <div className="h-screen w-screen bg-blue-100 flex flex-col items-center justify-center p-6 relative">

      {/* Logo top-left */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 md:left-4 md:transform-none md:-translate-x-0">
        <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin" />
        <h1
          className="text-xl font-bold text-blue-700 drop-shadow-md"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          Chatme
        </h1>
      </div>

      {/* User Image and Dropdown - top-right */}
      {image && (
        <div className="absolute top-4 right-4 flex flex-col items-end">
          <img
            src={image}
            alt="Profile"
            onClick={toggleUserInfo}
            className="h-12 w-12 rounded-full border-2 border-blue-500 shadow-md cursor-pointer transition hover:scale-105"
          />

          {/* Dropdown panel */}
          <div
            className={`bg-white border border-blue-200 rounded-md shadow-lg mt-2 p-3 text-sm w-48 transition-all duration-300 overflow-hidden ${
              showUserInfo ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <p className="text-blue-700 font-semibold truncate">👤 {name}</p>
            <p className="text-gray-600 truncate mb-2">📞 {phone}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-400 to-red-700 text-white py-1.5 mt-2 rounded shadow hover:opacity-90 transition duration-300"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <div className="flex flex-col gap-3 mt-4">
          <button className="bg-gradient-to-r from-blue-400 to-blue-700 text-white py-2 rounded shadow hover:opacity-90 hover:scale-105 transition duration-300 ease-in-out">
            ➕ Invite Friends
          </button>
          <button className="bg-gradient-to-r from-blue-400 to-blue-700 text-white py-2 rounded shadow hover:opacity-90 hover:scale-105 transition duration-300 ease-in-out">
            💬 Start Chatting
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
