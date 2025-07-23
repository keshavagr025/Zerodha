import React from "react";
import Spline from "@splinetool/react-spline";

function NotFound() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1f1c2c, #928dab)",
        color: "white",
        overflow: "hidden",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "800px", height: "400px" }}>
        <Spline scene="https://prod.spline.design/oTP8YhGOi5cHK8VN/scene.splinecode" />
      </div>

      <h1 className="mt-4 fw-bold display-4">404 – Page Not Found</h1>
      <p className="lead mt-2">
        Oops! The page you're looking for doesn't seem to exist.
      </p>
      <a href="/" className="btn btn-outline-light mt-4 px-4 py-2">
        ⬅ Back to Home
      </a>
    </div>
  );
}

export default NotFound;
