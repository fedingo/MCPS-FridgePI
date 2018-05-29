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
    host: "http://192.168.43.99:8000/"
  };

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
