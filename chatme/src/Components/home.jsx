import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, phone, image } = location.state || {};

  useEffect(() => {
    // Redirect if no user info found (protect route)
    if (!phone) {
      navigate('/');
    }

    // Load Orbitron font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, [phone, navigate]);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="h-[100vh] w-screen bg-blue-100 flex flex-col items-center justify-center p-6">
      {/* Logo with rotating circle */}
      <div className="relative flex items-center justify-center mb-30">
        <div className="absolute w-30 h-30 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin z-0" />
        <h1
          className="text-lg font-bold text-blue-700 drop-shadow-md z-10"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          Chatme
        </h1>
      </div>

      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Welcome, {name || 'User'}! 👋</h2>

        {image && (
          <img
            src={image}
            alt="Profile"
            className="h-20 w-20 rounded-full mx-auto mb-4 border-2 border-blue-500"
          />
        )}

        <p className="text-gray-700 mb-4">
          You're now logged in with phone number: <strong>{phone}</strong>
        </p>

        <div className="flex flex-col gap-3 mt-4">
        <button className="bg-gradient-to-r from-blue-400 to-blue-700 text-white py-2 rounded shadow hover:opacity-90 hover:scale-105 transition duration-300 ease-in-out">
            ➕ Invite Friends
          </button>
          <button className="bg-gradient-to-r from-blue-400 to-blue-700 text-white py-2 rounded shadow hover:opacity-90 hover:scale-105 transition duration-300 ease-in-out">
            💬 Start Chatting
          </button>
          <button
  onClick={handleLogout}
  className="bg-gradient-to-r from-red-400 to-red-700 text-white py-2 rounded shadow hover:opacity-90 hover:scale-105 transition duration-300 ease-in-out">
  Logout
</button>

        </div>
      </div>
    </div>
  );
}

export default Home;
