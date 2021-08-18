import { React, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

/* Creating landing component for the landing page */
function landing() {
  return (
    <Fragment>
      {/* Using Helmet to provide page's title */}
      <Helmet>
        <title>Stress Scale</title>
      </Helmet>
      <div className="container landing-container">
        <div className="wrapper landing-nav-wrapper">
          {/* Giving the logo on the landing page */}
          <div className="logo"></div>

          {/* List of link buttons for navigation  */}
          <ul className="nav-list">
            <Link to="/login">
              <li className="list-item">Login</li>
            </Link>
            <Link to="register">
              <li className="list-item">Register</li>
            </Link>
          </ul>
        </div>

        {/* Footer with links */}
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

export default landing;
