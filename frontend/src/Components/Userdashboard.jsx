import React, {useEffect} from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaDog } from "react-icons/fa6";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Userdashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const expiry = localStorage.getItem("sessionExpiry");
    const interval = setInterval(() => {
      if (expiry && new Date().getTime() > parseInt(expiry)) {
        alert("Your session has expired. You will be redirected to the home page.");
        localStorage.removeItem("sessionExpiry");
        navigate("/");
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Logged out successfully!');

        // Delay navigation so user can see the toast
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred while logging out:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <ToastContainer /> {/* Toast container for showing messages */}

      <div className="sidebar">
        <h3 className="orange-text">User Dashboard</h3>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="SearchDogs" className="nav-link">
                <FaDog className="nav-icon" /> Search Dog's
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="nav-link logout">
                <FaSignOutAlt className="nav-icon" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
