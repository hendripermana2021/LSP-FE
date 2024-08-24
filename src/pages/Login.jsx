import React, { useEffect, useState } from "react";
import Logo from "../assets/images/logos/logo.png";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import serverDev from "../Server";
import Swal from "sweetalert2";
import "../assets/css/index.css";
import "../assets/css/responsive.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in local storage
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      // Redirect to dashboard page
      navigate("/dashboard");
    }
  }, [navigate]);

  const Login = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    try {
      const post = await axios.post(`${serverDev}login`, {
        email,
        password,
      });
      const token = post.data.accessToken;
      sessionStorage.setItem("accessToken", token);
      setIsSubmitting(false);

      Swal.fire({
        icon: "success",
        title: "Login Success",
        text: "You have successfully logged in!",
      });
      navigate("/dashboard");
    } catch (error) {
      setIsSubmitting(false);

      if (error.response) {
        console.log(error.response.data);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid username or password",
        });
      }
    }
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img
          src="https://naevaweb.com/userfiles/uploads/naevaschool-2.svg"
          height={100}
          alt="NaevaScool"
        />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="login-center">
            <h2>Login Page</h2>
            <p>Please enter your details</p>
            <form onSubmit={Login}>
              <input
                type="email"
                placeholder="Email"
                style={{ fontSize: "1.5em" }}
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  id="password"
                  style={{ fontSize: "1.5em" }}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>

              <div className="login-center-buttons">
                <button type="submit" style={{ width: "25%", margin: "auto" }}>
                  {" "}
                  {isSubmitting ? "Loading..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
