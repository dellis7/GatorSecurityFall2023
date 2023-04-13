import React from 'react';
import GetConfig from '../Config.js';
import {MDBCarousel, MDBCarouselItem} from 'mdb-react-ui-kit';

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
    <MDBCarousel showControls showIndicators style={carousel} interval={8000}>
      <MDBCarouselItem        
        className='w-100 d-block'
        itemId={1}
        src='./Orange-Background.png'
        alt='...'
      >
        <img src='./welcomeImg.png' style={image} alt="Stick Figure Waving"></img>
        <h5 style={title}>Welcome {name}!</h5>
        <p style={caption}>Please navigate to the "Learn" page to read up on important topics, and then head over to the "Game" page to test your knowledge.</p>
      </MDBCarouselItem>
      <MDBCarouselItem
        className='w-100 d-block'
        itemId={2}
        src='./Orange-Background.png'
        alt='...'
      >
        <img src='./scoreImg.png' style={image} alt="Ascending Steps with Flag on Last Step"></img>
        <h5 style={title}>Checking Your Score</h5>
        <p style={caption}>Take a look at your "My Profile" page to see your progress. There you can see how many sections and game questions you have completed. Keep up the great work!</p>
      </MDBCarouselItem>
      <MDBCarouselItem        
        className='w-100 d-block'
        itemId={3}
        src='./Orange-Background.png'
        alt='...'
      >
        <img src='./creatorImg.png' style={image} alt="Lightbulb"></img>
        <h5 style={title}>The Creators</h5>
        <p style={caption}>This website was created by University of Florida students Daymao Silva, Erick Gonzalez, and Annalina Becker for their Fall 2022 senior project. They were advised under Professor Cheryl Resch.</p>
      </MDBCarouselItem>
      <MDBCarouselItem        
        className='w-100 d-block'
        itemId={3}
        src='./Orange-Background.png'
        alt='...'
      >
        <img src='./creatorImg.png' style={image} alt="Lightbulb"></img>
        <h5 style={title}>The Creators</h5>
        <p style={caption}>Development of this website was continued in Spring 2023 by University of Florida seniors Kerry Hannigan, Dylan Tosh, Connor Wojtak, Jacob Boney, and Brian Hoblin under Professor Cheryl Resch.</p>
      </MDBCarouselItem>
    </MDBCarousel>
  );
}}