import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { email, password } = formData;
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        setSuccess("Login successful! 🎉");

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        // Redirect to dashboard
        window.location.href = "http://localhost:3001/dashboard";
      } else {
        setError(response.data.message || "Login failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login to Your Account</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control" value={formData.password} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        <p className="mt-3 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary" style={{ textDecoration: "underline" }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
