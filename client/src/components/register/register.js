import { React, Fragment, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Axios from "axios";

/* Creating the 'register' component */
function Register() {
  const [registerIdInput, setregisterIdInput] = useState("");
  const [registerPasswordInput, setregisterPasswordInput] = useState("");

  /* Handaling the Login functionalities with reg() */
  const reg = () => {
	  if (!registerIdInput) {
		 alert("No id") 
		 return;
	  }
	  if (!registerPasswordInput) {
		  alert("No password")
		  return;
	  }
    Axios.post("/api/register", {
      userId: registerIdInput,
      userPassword: registerPasswordInput,
    }).then((response) => {
      if (
        response.data.message ===
        "User already exists, please choose a different User ID."
      ) {
        alert(response.data.message);
      } else if (
        response.data.message ===
        "User registered successfully. Please Login to continue!"
      ) {
        alert(response.data.message);
        window.location = "/";
      } else {
        alert("Sorry, some error occured!");
        console.log(response.data.message);
      }
    });
  };

  return (
    <Fragment>
      <Helmet>
        <title>Stress Scale</title>
      </Helmet>
      <div className="container landing-container">
        <div className="wrapper landing-nav-wrapper">
          <div className="logo"></div>
          <div className="form register-form">
            {/* Setting up the ID and Password for sending to server */}
            <input
              type="text"
              id="registerIdInput"
              onChange={(e) => {
                setregisterIdInput(e.target.value);
              }}
              placeholder="Enter your User ID..."
            />
            <input
              type="password"
              id="registerPasswordInput"
              onChange={(e) => {
                setregisterPasswordInput(e.target.value);
              }}
              placeholder="Enter your Password..."
            />
            <ul className="nav-list">
              {/* Calling reg() function on clicking the button */}
              <Link onClick={reg}>
                <li className="list-item">Register</li>
              </Link>
            </ul>
          </div>
          {/* Link to go back to landing page */}
          <Link to="/">
            <button className="btn btn-form btn-register">Go back</button>
          </Link>
        </div>
        <div className="wrapper landing-footer-wrapper">
          <ul className="footer-nav-list">
            <label>Helpful links:</label>
            <a
              href="https://www.healthline.com/nutrition/16-ways-relieve-stress-anxiety"
              target="_blank"
              rel="noreferrer"
            >
              <li className="footer-list-item">
                16 Simple Ways to Relieve Stress and Anxiety
              </li>
            </a>
            <a
              href="https://www.mentalhealth.org.uk/publications/how-manage-and-reduce-stress"
              target="_blank"
              rel="noreferrer"
            >
              <li className="footer-list-item">
                How to manage and reduce stress
              </li>
            </a>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default Register;
