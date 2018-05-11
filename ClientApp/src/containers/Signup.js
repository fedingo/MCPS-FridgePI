import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import axios from 'axios';


export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {

    // chiamata per autenticazione

    event.preventDefault();
    console.log("ok")
    this.setState({ isLoading: true });


    try {
      const newUser = {
        username: this.state.email,
        password: this.state.password
      };


      this.setState({
        newUser
      });
    } catch (e) {
      alert(e.message);
    }

    this.setState({ isLoading: false });

    try {
      this.props.userHasAuthenticated(true);
      console.log(this.state.email);
      console.log(this.state.password);

      axios.get('http://192.168.1.105:8000/register', {
          params: {
            username: this.state.email,
            password: this.state.password
          }
        })
    //  axios.get('http://192.168.1.105:8000/authenticate?username=topolino&password=pippo')
       .then(response =>{ this.setState({api: response.data.code})
      console.log('Success!')
      console.log(this.state.api);

      if(this.state.api==200){
        this.props.userInsert(this.state.email);
        this.props.passwordInsert(this.state.password);
        this.props.history.push({
          pathname:'/lista',
          state: { user: this.state.email,
                    password: this.state.password}
        });
      }
      else {
        alert("errore");
      }
    });
    } catch (e) {
      alert(e.message);
    }

  }

  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {

      this.props.userHasAuthenticated(true);

      this.props.history.push("/lista");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }


  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  renderForm() {
    return (
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
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
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
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.renderForm()
          }
      </div>
    );
  }
}
