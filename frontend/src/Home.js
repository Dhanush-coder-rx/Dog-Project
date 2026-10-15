import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css"; // Custom CSS for extra styling

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container d-flex align-items-center justify-content-center text-white text-center">
      <div className="overlay"></div>
      <div className="content">
        <h1 className="display-4 fw-bold">Find Your New Best Friend</h1>
        <p className="lead">Easily search, match, and adopt your perfect dog companion.</p>
        <button className="btn btn-primary btn-lg mt-3 shadow" onClick={() => navigate("/Login")}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;


