import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [view, setView] = useState('login'); 
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  
  // Registration OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  // Helper: get all users from localStorage
  const getUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  // Helper: save all users to localStorage
  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
    } else {
      alert('Please upload a valid image file.');
    }
  };

  // Login handler: no OTP, just check phone exists
  const handleLogin = () => {
    if (!phone) {
      alert('Please enter phone number');
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.phone === phone);

    if (user) {
      alert(`Welcome back, ${user.name}!`);
      navigate('/home', { state: { name: user.name, phone: user.phone, image: user.image } });
    } else {
      alert('Phone number not registered. Please register first.');
    }
  };

  // Registration: Send OTP to phone (simulate)
  const handleSendOtp = () => {
    if (!phone) {
      alert('Please enter phone number');
      return;
    }

    const users = getUsers();
    const alreadyRegistered = users.some(u => u.phone === phone);
    if (alreadyRegistered) {
      alert('Phone number already registered. Please login.');
      setView('login');
      return;
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);

    alert(`OTP sent to ${phone} (for demo: ${otp})`); // In real app, do NOT alert the OTP!
  };

  // Verify OTP input
  const handleVerifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      alert('OTP verified! Please complete registration.');
      setOtpVerified(true);
    } else {
      alert('Incorrect OTP, please try again.');
    }
  };

  // Register user after OTP verified
  const handleRegister = () => {
    if (!otpVerified) {
      alert('Please verify OTP first');
      return;
    }
    if (!name || !phone) {
      alert('Please enter name and phone number');
      return;
    }

    const users = getUsers();
    const newUser = { name, phone, image };
    users.push(newUser);
    saveUsers(users);

    alert(`Registered successfully! Welcome, ${name}`);
    navigate('/home', { state: newUser });
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
            <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Login</h2>
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
              Login
            </button>

            <p className="text-sm text-center">
              Don't have an account?{' '}
              <button onClick={() => {
                setView('register');
                // Reset all registration states
                setOtpSent(false);
                setOtpVerified(false);
                setName('');
                setEnteredOtp('');
                setImage(null);
              }} className="text-blue-600 underline">
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Register</h2>
            
            {!otpSent ? (
              <>
                {/* Step 1: Enter phone + Send OTP */}
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                />
                <button
                  onClick={handleSendOtp}
                  className="w-full bg-blue-500 text-white p-2 rounded mb-4 hover:opacity-90 transition"
                >
                  Send OTP
                </button>
              </>
            ) : !otpVerified ? (
              <>
                {/* Step 2: Enter OTP to verify */}
                <p className="mb-2 text-center text-gray-700">OTP sent to {phone}</p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-green-500 text-white p-2 rounded mb-4 hover:opacity-90 transition"
                >
                  Verify OTP
                </button>
                <button
                  onClick={() => {
                    // Resend OTP logic (just generate new OTP)
                    handleSendOtp();
                    setEnteredOtp('');
                  }}
                  className="w-full bg-gray-300 text-black p-2 rounded mb-4 hover:opacity-90 transition"
                >
                  Resend OTP
                </button>
              </>
            ) : (
              <>
                {/* Step 3: Fill name, image and Register */}
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                />
                <input
                  type="file"
                  accept="image/*"
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
                  className="w-full bg-blue-600 text-white p-2 rounded mb-2 hover:opacity-90 transition"
                >
                  Register
                </button>
              </>
            )}
            
            <p className="text-sm text-center mt-4">
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
