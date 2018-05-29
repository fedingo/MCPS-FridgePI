import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Recipes.css";
import axios from 'axios';

export default class NewNote extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      isLoading: null,
      content: "",
      username:'',

    };

    this.handleRecipes = this.handleRecipes.bind(this);
    this.onClickbutton = this.onClickbutton.bind(this);
  }

  onClickbutton(event){
    alert("ciao");
  }

  handleRecipes(event){

    var listContainer = document.getElementById("container1")

    axios.get(this.props.host+'suggestRecipes', {
        params: {
          username: this.props.user,
          password: this.props.password,
        }
      })
     .then(response =>{
        this.setState({content: response.data.result})
        if(response.data.code===200){
          console.log('Success!');
           listContainer.innerHTML="";

           for(var i=0; i<this.state.content.length;i++)
              listContainer.innerHTML+="<div class=\"immagini\" width=\"30\%\"/>";

           var itemContainers = document.getElementsByClassName("immagini");

           for(var i=0; i<this.state.content.length;i++){

             var imageReveal = this.state.content[i].image_url;
             itemContainers[i].innerHTML+="<b class=\"myTitle\">"+this.state.content[i].title+"</b> "+
             "<Image src=\"" + imageReveal + " \" width=\"60\%\"/>"+"</div>"+
             "<a class=\"linkButton\" href=\""+this.state.content[i].source_url+"\">Open Recipe "+
             "<span class=\"glyphicon glyphicon-search\" ></span> </a>"+
             "";
          }
        }
        else {
          console.log("Log in or Sign up");
          console.log("Erroe in Recipes");
        }
      })
  }

  render() {
    return (
      <div className="NewNote">

      <h1 className="title_page">Recipes</h1>

        <div  className="container_img" id="container1">

         </div>
          <button className='button' onClick={this.handleRecipes}>Update</button>
      </div>
    );
  }
}
