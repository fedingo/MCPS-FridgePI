import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { Link, withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "../Routes";
import axios from 'axios';

import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.host)
    this.state = {
      isLoading: false,
      email: "",
      password: "",
      api: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }


handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      this.props.userHasAuthenticated(true);

      console.log(this.state.email);
      console.log(this.state.password);
      this.props.userInsert(this.state.email);
      this.props.passwordInsert(this.state.password);

      axios.get(this.props.host+'authenticate', {
          params: {
            username: this.state.email,
            password: this.state.password
          }
        })
       .then(response =>{ this.setState({api: response.data.code})


      if(this.state.api==200){
        console.log('Success!')
        console.log(this.state.api);
        console.log("prova "+this.state.email)
        this.props.history.push({
          pathname:'/lista',
          state: { user: this.state.email,
                  password: this.state.password}
        });
      }
      else {
        alert("password errata");
      }
    });
    } catch (e) {
      alert(e.message);
    }
  }

  render() {

    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>

      </div>
    );
  }
}
