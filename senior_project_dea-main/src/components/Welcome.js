import React from 'react';
import GetConfig from '../Config.js';
import Carousel from 'react-bootstrap/Carousel'

export default class WelcomePage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      userInfo: null
    };
  }
  componentDidMount(){
    fetch(GetConfig().SERVER_ADDRESS + "/users/userInfo", 
      {
        method: "POST",
        crossDomain:true,
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body:JSON.stringify({
        token:window.localStorage.getItem("token"),
      }),
      }).then((res)=>res.json())
      .then(data=>{
        this.setState({userInfo: data.data});
      });
  }
  render(){
    const carousel = {    
        position: "absolute",
        top: "calc(50% + 40px)",
        left: "50%",
        transform: "translate(-50%, -50%)"
    }

    const title = {
        fontFamily:"Gluten",        
        color:"white"
    }

    const caption = {
        fontFamily:"Gluten",
        color:"white"
    }

    const image = {
        height:"8rem"
    }

    if(this.state.userInfo == null) {
      return <div></div>
    }
    
    let name = this.state.userInfo["fname"];

  return (
    <Carousel style={carousel} interval={8000}>
      <Carousel.Item   
        className='w-100 d-block'
        itemId={1}
        src='./Orange-Background.png'
        alt='...'
      >
        <img src='./1.png' style={image} alt="Stick Figure Waving"></img>
      </Carousel.Item>
      <Carousel.Item
        className='w-100 d-block'
        itemId={2}
        src='./Orange-Background.png'
        alt='...'
      >
        <img src='./2.png' style={image} alt="Ascending Steps with Flag on Last Step"></img>
      </Carousel.Item>
      <Carousel.Item        
        className='w-100 d-block'
        itemId={3}
        src='./Orange-Background.png'
        alt='...'
      >
        <img src='./3.png' style={image} alt="Lightbulb"></img>
      </Carousel.Item>
      <Carousel.Item     
        className='w-100 d-block'
        itemId={3}
        src='./Orange-Background.png'
        alt='...'
      >
        <img src='./4.png' style={image} alt="Lightbulb"></img>
      </Carousel.Item>
    </Carousel>
  );
}}