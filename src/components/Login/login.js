import React, { Component } from "react";
import "./login.css";
import logo from './communityBank.svg';

export default class Login extends Component {
  render() {
    return (
      <div className="Login">
        <img src={logo} />
        <a href={process.env.REACT_APP_LOGIN}>
          <button type="" className="">
            Login
          </button>
        </a>
      </div>
    );
  }
}
