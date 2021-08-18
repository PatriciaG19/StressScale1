import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';
import Landing from "./components/landing/landing";
import Register from "./components/register/register";
import Login from "./components/login/login";
import QuestionsPage from "./components/questions/questions";
import Summary from "./components/summary/summary";


/* Creating the App */
function App() {
  return (
    /* Handaling routes to different paths */
    <Router>
      <Route exact path="/" component={Landing}></Route>
      <Route exact path="/register" component={Register}></Route>
      <Route exact path="/login" component={Login}></Route>
      <Route exact path="/questions" component={QuestionsPage}></Route>
      <Route exact path="/summary" component={Summary}></Route>
    </Router>
  );
}

export default App;
