import React, { Component, Fragment } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";

import Routes from "./Routes";

class App extends Component {

  constructor(props) {
  super(props);

  this.state = {
    isAuthenticated: false,
    isAuthenticating: true,
    user:'',
    password:''
  };
}

async componentDidMount() {

  this.userHasAuthenticated(true);
  this.setState({ isAuthenticating: false });
}

userHasAuthenticated = authenticated => {
  this.setState({ isAuthenticated: authenticated });
}

userInsert = email =>{
  this.setState({ user: email})
}

passwordInsert = pass =>{
  this.setState({password:pass})
}

handleLogout = async event => {

  this.userHasAuthenticated(false);
  this.props.history.push("/login");
}

handleLista = async even => {
  this.props.history.push("/lista");
}

render() {
  var childProps = {
    isAuthenticated: this.state.isAuthenticated,
    userHasAuthenticated: this.userHasAuthenticated,
    user: this.state.user,
    password: this.state.password,
    userInsert: this.userInsert,
    passwordInsert: this.passwordInsert,
    host: "http://localhost:80/"
  };
//     host: "http://192.168.1.197:8000/"

  return (
    !this.state.isAuthenticating &&
    <div className="App container">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Home</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {this.state.isAuthenticated && this.state.user
              ? <Fragment><NavItem onClick={this.handleLogout}>Logout</NavItem>
              <NavItem onClick={this.handleLista}>Lista</NavItem></Fragment>
              : <Fragment>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Fragment>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes childProps={childProps} />
    </div>
  );
}
}

export default withRouter(App);





/*


import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import DocumentTitle from 'react-document-title'
import {Link} from 'react-router'

// As a quick reminder, our goal is to get back a user’s name from the /users/:username endpoint

class App extends Component {

  constructor () {
    super()
    this.state = {
      username:''
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.setState({
     showComponent: true,
     title: 'Lista'
    });
    axios.get('https://api.github.com/users/sever567')
     .then(response => this.setState({username: response.data.login}))
    console.log('Success!')
  }

  handleSubmit(event) {
    event.preventDefault();

    window.location = "http://localhost:3000/Login";
}

  render() {
    return (
      <DocumentTitle title={this.state.title}>
      <div>
      <h1 className="title_page">FridgePI</h1>

      <div className='button__container'>
        <div className='list_container'>
           <ul>
           <li>{this.state.username}</li>
           <li>{this.state.username}</li>
           <li>{this.state.username}</li>
           <li>{this.state.username}</li>
           <li>{this.state.username}</li>
           <li>{this.state.username}</li>
           </ul>
         </div>
         <button className='button' onClick={this.handleClick}>Aggiorna</button>
         <Link onClick ={this.handleSubmit} >link</Link>
      </div>
      </div>
      </DocumentTitle>

    );
  }
}

export default App

*/
