import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.21 0 5.99 1.1 8.03 3.03l6.36-6.36C34.04 2.86 29.63 1 24 1 14.32 1 6.36 6.7 3.18 15.18l7.86 6.1C12.25 14.68 17.68 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h12.8c-.57 2.73-2.2 5.04-4.64 6.62l7.27 5.66C43.46 37.1 46.98 31.35 46.98 24.55z" />
    <path fill="#FBBC05" d="M11.04 21.28c-.47 1.48-.73 3.04-.73 4.6s.26 3.12.73 4.6l-7.86 6.1C1.23 32.75 0 28.5 0 24s1.23-8.75 3.18-12.52l7.86 6.1z" />
    <path fill="#34A853" d="M24 47c6.48 0 11.93-2.13 15.89-5.82l-7.27-5.66c-2.13 1.44-4.86 2.3-7.62 2.3-6.36 0-11.73-4.16-13.63-9.82l-7.86 6.1C6.36 40.3 14.32 47 24 47z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.81C10.44 7.31 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const handleRegister = async () => {
    const { name, lastName, email, password, role } = userData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!name || !lastName || !email || !password || !role) {
      toast.warning("Please fill in all the fields");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
      return;
    }

    const resultAction = await dispatch(registerUser(userData));

    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("User registered successfully");
    
      setUserData({
        name: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
      });
    
      setTimeout(() => {
        navigate("/Login");
      }, 1500); 
    }
    
  };

  useEffect(() => {
    setUserData({
      name: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6 flex items-center justify-center">
          <span className="text-2xl font-bold text-blue-600"><Logo /></span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mt-2">Sign up</h2>
        </div>

        <div className="space-y-3 mb-6">
          <button type="button" className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <GoogleIcon /> Continue with Google
          </button>
          <button type="button" className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <FacebookIcon /> Continue with Facebook
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex space-x-4">
            <input type="text" placeholder="First Name" className="rounded-md w-1/2 px-3 py-2 border"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              required
            />
            <input type="text" placeholder="Last Name" className="rounded-md w-1/2 px-3 py-2 border"
              value={userData.lastName}
              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
              required
            />
          </div>

          <input type="email" placeholder="Email address" className="rounded-md w-full px-3 py-2 border"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />

          <div className="relative">
            <input type="password" placeholder="Password" className="rounded-md w-full px-3 py-2 border"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              required
            />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
              <EyeIcon />
            </button>
          </div>

          <select value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })} required
            className="rounded-md w-full px-3 py-2 border">
            <option value="" disabled>Select your role</option>
            {/* <option value="admin">Admin</option> */}
            <option value="jobseeker">Job Seeker</option>
            <option value="hiringperson">Hiring Person</option>
          </select>

          <div className="flex items-center">
            <input type="checkbox" id="agree" name="agree" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            <label htmlFor="agree" className="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>

          <button type="submit" onClick={handleRegister}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <Link to="/Login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
