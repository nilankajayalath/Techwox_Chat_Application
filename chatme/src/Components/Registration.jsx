import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [view, setView] = useState('login'); 
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleLogin = () => {
    if (!phone) {
      alert('Please enter phone number');
      return;
    }

    alert(`Logging in with phone: ${phone}`);
    navigate('/home', { state: { name, phone, image } });
  };

  const handleRegister = () => {
    if (!name || !phone) {
      alert('Please enter name and phone number');
      return;
    }

    alert(`Registering: ${name} - ${phone}`);
    navigate('/home', { state: { name, phone, image } });
  };

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
              className="w-full bg-gradient-to-r from-blue-300 to-blue-700 text-white p-2 rounded mb-2 shadow-md hover:opacity-90 transition"
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
    </div>
  );
}

export default Register;
