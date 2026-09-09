import { useState } from "react";
import axios from "axios";

function Login({ onLogin, onShowSignup,darkMode,onToggleTheme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password
        }
      );
    if(response.data.success){
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user",JSON.stringify(response.data.user));

      onLogin(response.data.user);
    }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };



return (
  <div className={`auth-container ${darkMode ? "dark-theme" : "light-theme"}`}>

    {/* Ambient background */}
    <div className="auth-glow auth-glow-one"></div>
    <div className="auth-glow auth-glow-two"></div>
    <div className="auth-glow auth-glow-three"></div>

    {/* Theme Toggle */}
    <button
      type="button"
      className="auth-theme-toggle"
      onClick={onToggleTheme}
      title="Change theme"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>

    <div className="auth-box">

      {/* Logo */}
      <div className="auth-logo">
        <div className="auth-logo-inner">
          ✦
        </div>
      </div>

      {/* Brand */}
      <div className="auth-brand">
        <span></span>
        AI ASSISTANT
        <span></span>
      </div>

      {/* Heading */}
      <div className="auth-heading">

        <div className="auth-status">
          <span></span>
          Welcome back
        </div>

        <h2>
          Welcome Back <span>👋</span>
        </h2>

        <p>
          Sign in to continue to your
          <br />
          <strong>AI Assistant</strong>
        </p>

      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="auth-form">

        {/* Email */}
        <div className="input-group">

          <label>Email address</label>

          <div className="auth-input">

            <span className="input-icon">✉</span>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

        </div>

        {/* Password */}
        <div className="input-group">

          <div className="password-label">
            <label>Password</label>
            <span>Secure</span>
          </div>

          <div className="auth-input">

            <span className="input-icon">🔒</span>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="auth-error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {/* Login button */}
        <button
          type="submit"
          className="auth-submit"
        >
          <span>Login to Assistant</span>
          <span className="login-arrow">→</span>
          <div className="button-glow"></div>
        </button>

      </form>

      {/* Divider */}
      <div className="auth-divider">
        <span></span>
        <p>OR</p>
        <span></span>
      </div>

      {/* Signup */}
      <div className="auth-footer">

        <p>
          Don't have an account?
        </p>

        <button
          type="button"
          className="link-button"
          onClick={onShowSignup}
        >
          Create Account
          <span>→</span>
        </button>

      </div>

      {/* Bottom badge */}
      <div className="secure-badge">
        <span>✦</span>
        Secure & private
        <i></i>
        JWT Protected
      </div>

    </div>

  </div>
);



}

export default Login;