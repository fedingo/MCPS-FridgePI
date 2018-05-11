import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./NewNote.css";
import axios from 'axios';

export default class NewNote extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      isLoading: null,
      content: "",
      username:'',
      value: '',
      shelf:'',
      lista: '',
      lista2: ''

    };
    this.handleClick = this.handleClick.bind(this)
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChangeTextShelf = this.handleChangeTextShelf.bind(this);
    this.handleSubmitCode = this.handleSubmitCode.bind(this);
    this.handleClickRicette = this.handleClickRicette.bind(this);


  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleClick () {
    this.setState({
     showComponent: true,
     title: 'Lista',
    });

    var listTag = document.getElementById("tabellina")

    console.log(this.props.user)

    axios.get(this.props.host+'fetchStorage', {
        params: {
          username: this.props.user,
          password: this.props.password
        }
      })
  //  axios.get('http://192.168.1.105:8000/authenticate?username=topolino&password=pippo')
     .then(response =>{
        this.setState({lista: response.data.result})
        if(response.data.code===200){
          console.log('Success!');
        //  console.log(this.state.lista[0].list[0]);

          listTag.innerHTML="";
          for(var k=0; k<this.state.lista.length;k++){
            listTag.innerHTML+= "<b>"+this.state.lista[k].name+"</b><ul>";

            for(var i=0; i<this.state.lista[k].list.length; i++)
              listTag.innerHTML += "<li>"+ this.state.lista[k].list[i]+"</li>";
            listTag.innerHTML+="</ul>";
          }
        }
        else {
          console.log("Log in or Sign up");
          console.log("Errore in fetchStorage")
        }
      })

  }

  handleClickRicette (event){
    event.preventDefault();
    this.props.history.push({
      pathname:'/recipes',
      state: { user: this.state.email,
              password: this.state.password}
    });
  }

  handleSubmitCode (event){
    console.log('A name was submitted: ' + this.state.value);
    event.preventDefault();

    var listTag = document.getElementById("tabellina")


    axios.get(this.props.host+'connectDevice', {
        params: {
          username: this.props.user,
          password: this.props.password,
          shelfName: this.state.shelf,
          deviceID: this.state.value
        }
      })
  //  axios.get('http://192.168.1.105:8000/authenticate?username=topolino&password=pippo')
     .then(response =>{
        this.setState({lista2: response.data.result})
        if(response.data.code===200){
          console.log('Success!');
          alert("device " + this.state.value+" added");
        }
        else {
          console.log("Erroe in connectDevice")
        }
      })

  }

  handleChangeText(event) {
    this.setState({value: event.target.value});
  }

  handleChangeTextShelf(event){
    this.setState({shelf: event.target.value});
  }

  render() {

    return (
      <div className="NewNote">



      <h1 className="title_page">My Fridge</h1>

      <div className='button__container'>
        <div className='list_container'>

           <ul id="tabellina">

           </ul>
         </div>
         <button className='button' onClick={this.handleClick}>Aggiorna</button>
         <button className='button' onClick={this.handleClickRicette}>Recipes</button>
      </div>

      <form onSubmit={this.handleSubmitCode} className="text-center">
          <label>
          <h3 className="textTitle">Insert a new device: </h3>
            <input type="text"  className="form-control" placeholder="Device ID" value={this.state.value} onChange={this.handleChangeText} />
            <input type="text"  className="form-control" placeholder="Shelf Name" value={this.state.shelf} onChange={this.handleChangeTextShelf} />
          </label> <br/>
          <input className="submitButton" type="submit" value="Submit" />
        </form>

      </div>
    );
  }
}

//<li>{this.props.location.state.password} </li>
