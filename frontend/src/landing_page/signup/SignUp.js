import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Make sure you're using react-router

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/auth/signup", {
        username: name,
        email,
        password,
      });

      if (response.data.success) {
        setSuccess("Signup successful! 🎉");

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        // Redirect after success
        window.location.href = "http://localhost:3001/dashboard";
      } else {
        setError(response.data.message || "Signup failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Create an Account</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input name="name" type="text" className="form-control" value={formData.name} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control" value={formData.password} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input name="confirmPassword" type="password" className="form-control" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary" style={{ textDecoration: "underline" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
