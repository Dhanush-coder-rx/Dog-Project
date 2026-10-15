import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import bgImage from "./home.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      await axios.post(
        "https://frontend-take-home-service.fetch.com/auth/login",
        formData,
        { withCredentials: true }
      );
  
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000,
      });
  
      setError("");
  
      // Set session expiry time in localStorage
      const expiryTime = new Date().getTime() + 3600000; // 1 hour
      localStorage.setItem("sessionExpiry", expiryTime);
  
      // Redirect after short delay
      setTimeout(() => navigate("/Userdashboard"), 1000);
    } catch (err) {
      setError("Invalid login or server error.");
    }
  };
  

  const isFormValid = formData.name && formData.email;

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "24rem",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "1rem",
          boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
          marginLeft: "550px", // Shift card to the right
        }}
      >
        <h2 className="mb-4 text-center text-primary">Welcome Back!</h2>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
          disabled={!isFormValid}
        >
          Login
        </button>
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
