import React, { useState, useEffect } from 'react';

function Register() {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'home'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleLogin = () => {
    alert(`Logging in with phone: ${phone}`);
    setView('home');
  };

  const handleRegister = () => {
    alert(`Registering: ${name} - ${phone}`);
    setView('home');
  };

  // Load Orbitron font
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 p-4">
      
      {/* Logo Title with Rotating Circle */}
      <div className="relative flex items-center justify-center mb-10">
        <div className="absolute w-60 h-60 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin z-0" />
        <h1
          className="text-5xl font-bold text-blue-700 drop-shadow-md z-10"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          Chatme
        </h1>
      </div>

      {view === 'home' ? (
        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Welcome, {name || 'User'}! 👋</h2>
          {image && (
            <img
              src={image}
              alt="Profile"
              className="h-20 w-20 rounded-full mx-auto mb-4 border"
            />
          )}
          <p className="text-gray-700 mb-4">You're now logged in with phone number: {phone}</p>
          <button
            onClick={() => setView('login')}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm mt-20">
          {view === 'login' ? (
            <>
              <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center ">Login</h2>
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              <button
                onClick={handleLogin}
                className="w-full bg-green-500 text-white p-2 rounded mb-2"
              >
                Send OTP
              </button>
              <p className="text-sm text-center">
                Don't have an account?{' '}
                <button onClick={() => setView('register')} className="text-blue-600 underline">
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Register</h2>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2 mb-4 border rounded"
              />
              {image && (
                <img
                  src={image}
                  alt="Profile"
                  className="h-16 w-16 rounded-full mx-auto mb-4"
                />
              )}
              <button
                onClick={handleRegister}
                className="w-full bg-blue-500 text-white p-2 rounded mb-2"
              >
                Register
              </button>
              <p className="text-sm text-center">
                Already have an account?{' '}
                <button onClick={() => setView('login')} className="text-green-600 underline">
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Register;
