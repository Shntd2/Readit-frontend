import { useContext, useState, useEffect } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import ReaditLogo from "../../assets/png/readit-logo.png";
import CheckMark from "../../assets/svg/CheckMark.jsx";
import ShowPasswordIcon from "../../assets/svg/ShowPasswordIcon.jsx";
import HidePasswordIcon from "../../assets/svg/HidePasswordIcon.jsx";
import CryptoJS from 'crypto-js';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saveLogin, setSaveLogin] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [error, setError] = useState("");

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    const valid = emailPattern.test(email);
    setIsEmailValid(valid);
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    if (!isEmailValid) {
      setError("Please provide a correct email");
      return;
    }
    try {
      const clientHashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
      
      const result = await login({ email, password: clientHashedPassword });
      
      if (result.requirePasswordChange) {
        navigate("/login-first-time", { state: { token: result.token } });
      } else {
        navigate("/readit");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials");
    }
  };

  const handleCheckboxChange = () => {
    setSaveLogin((prev) => !prev);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <img src={ReaditLogo} alt="ARI Logo" />
        </div>
        <p>Readit</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon />}
              </button>
            </div>
          </div>
          <div className="input-group checkbox">
            <div className="checkbox-wrapper" onClick={handleCheckboxChange}>
              <input
                type="checkbox"
                id="saveLogin"
                name="saveLogin"
                checked={saveLogin}
                onChange={handleCheckboxChange}
              />
              <div className={`checkbox-icon ${saveLogin ? "checked" : ""}`}>
                <CheckMark />
              </div>
            </div>
            <label htmlFor="saveLogin">Save log in</label>
          </div>
          <button type="submit" className="login-button">
            Log in
          </button>
        </form>
        <Link to="/forgot-password" className="forgot-password">
          Forgot password?
        </Link>
      </div>
      {error && (
        <div className="error-popup">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
