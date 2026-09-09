import { useState } from "react";
import axios from "axios";


function Signup({ onShowLogin,darkMode,onToggleTheam }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          name,
          email,
          password
        }
      );

      setMessage(response.data.message);

      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Signup failed"
      );

    }
  };


return (
  <div className="signup-page">

    {/* Background effects */}
    <div className="signup-orb orb-1"></div>
    <div className="signup-orb orb-2"></div>
    <div className="signup-orb orb-3"></div>

    {/* Grid background */}
    <div className="signup-grid"></div>


    {/* Main card */}
    <div className="signup-card">

      {/* Theme switch */}
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheam}
        title="Toggle theme"
      >
        <span>☀️</span>
        <span>🌙</span>
      </button>


      {/* Top branding */}
      <div className="signup-brand">

        <div className="brand-icon">
          <div className="brand-icon-inner">
            ✦
          </div>
        </div>

        <div className="brand-line"></div>

        <span>AI ASSISTANT</span>

      </div>


      {/* Heading */}
      <div className="signup-heading">

        <div className="welcome-badge">
          <span></span>
          Join the future
        </div>

        <h1>
          Create your
          <br />
          <span>AI workspace.</span>
        </h1>

        <p>
          Build your personal AI experience.
          <br />
          Your conversations. Your space.
        </p>

      </div>


      {/* Form */}
      <form onSubmit={handleSignup} className="signup-form">

        {/* Name */}
        <div className="field">

          <label>Full name</label>

          <div className="field-box">

            <div className="field-icon">
              👤
            </div>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

          </div>

        </div>


        {/* Email */}
        <div className="field">

          <label>Email address</label>

          <div className="field-box">

            <div className="field-icon">
              @
            </div>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

        </div>


        {/* Password */}
        <div className="field">

          <div className="password-label">

            <label>Password</label>

            <span>Required</span>

          </div>

          <div className="field-box">

            <div className="field-icon">
              🔐
            </div>

            <input
              type="password"
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>

        </div>


        {/* Messages */}
        {error && (
          <div className="form-message error-message">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="form-message success-message">
            <span>✓</span>
            <p>{message}</p>
          </div>
        )}


        {/* Submit */}
        <button
          type="submit"
          className="create-button"
        >

          <span className="button-text">
            Create workspace
          </span>

          <span className="button-arrow">
            →
          </span>

          <span className="button-shine"></span>

        </button>

      </form>


      {/* Divider */}
      <div className="signup-divider">
        <span></span>
        <p>ALREADY A MEMBER?</p>
        <span></span>
      </div>


      {/* Login */}
      <div className="login-section">

        <button
          type="button"
          className="login-link"
          onClick={onShowLogin}
        >
          <span>Sign in to your workspace</span>
          <span>↗</span>
        </button>

      </div>


      {/* Footer */}
      <div className="signup-footer">

        <div>
          <span className="footer-dot"></span>
          Secure authentication
        </div>

        <span>•</span>

        <div>
          Private conversations
        </div>

      </div>

    </div>

  </div>
);
}
export default Signup;