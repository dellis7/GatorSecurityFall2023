import React from 'react';
import './css/personalProfile.css';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBProgress, MDBProgressBar, MDBBtn } from 'mdb-react-ui-kit';
import { LinkContainer } from "react-router-bootstrap";
import '../componentStyling/textStyling.css';
import GetConfig from '../../Config.js';
import "./css/profile.css"
import "./css/debug.css"
import apiRequest from '../../util/api.js';

export default class ProfilePage extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        userInfo: null
      };
    }
    
    componentDidMount(){

      //Function that pulls the current user's profile info from the backend
      apiRequest("/users/userInfo").then((res)=>res.json())
      .then(data=>{
        //Set userInfo with data retrieved from backend
        this.setState({userInfo: data.data.dbUserData});
      });

      //Function that pulls the total number of questions from the backend
      apiRequest("/questions/getCount/learn").then((res)=>res.json())
      .then(data=>{
        //Set the total number of learn questions to learnQuestionCount
        this.setState({learnQuestionCount: data.data})
      });

      //Function that pulls the total number of questions from the backend
      apiRequest("/questions/getCount/game").then((res)=>res.json())
      .then(data=>{
        //Set the total number of fill in the blank questions to gameQuestionCount
        this.setState({gameQuestionCount: data.data})
      });

      //Function that pulls the total number of games from the backend
      apiRequest("/games/getCount").then((res)=>res.json())
      .then(data=>{
        //Set the total number of game questions (except for Fill in the Blank Questions) to allGamesCount
        this.setState({allGamesCount: data.data})
      });
    }

    //Everything after this has to do with web page rendering
    render(){
      //CSS For Profile Page
      const container = {
        display: "block",        
        marginLeft: "auto",
        marginRight: "auto",        
        fontFamily:"Gluten",
        paddingTop: "50px"
      };
      
      //If userInfo doesn't exist, return a blank page
      if(this.state.userInfo == null){
        return <div></div>
      }

      //Set values for return section
      let fullName = this.state.userInfo["fname"] + " " + this.state.userInfo["lname"];
      let email = this.state.userInfo["email"];
      let gameScore = this.state.userInfo["gamescore"].length;
      let gameMax = this.state.gameQuestionCount + this.state.allGamesCount;
      let gamePercentage = Math.floor(gameScore/gameMax * 100);
      let learnScore = this.state.userInfo["learnscore"].length;
      let learnMax = this.state.learnQuestionCount;
      let learnPercentage = Math.floor(learnScore/learnMax * 100);

      //This is the HTML that is rendered to the webpage
      return (
        <div>
        <div style={{marginRight: '2vw'}}>
          <form  style={{marginTop: '4vh', width: '25%', marginLeft: 'auto', textAlign: 'left'}}>
            <div style={{marginTop: '1vh', fontSize: '28px'}}>Join a Class!</div>
            <div>
              <div>
                <label htmlFor="class"></label>
                <input type="text" id="class" name="class"
                        placeholder={"Enter the Class ID"}/>
              </div>
            </div>

            <button type="submit" className="btn btn-primary blue btn-lg" style={{marginTop: '5vh', marginLeft: '5vw'}}>
                Submit
            </button>
          </form>
        </div>
        <section style={container}>
          <MDBContainer className="py-5 h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol lg="8" className="mb-4 mb-lg-0">
                <MDBCard style={{ borderRadius: '.5rem' }}>
                  <MDBRow className="g-0">
                    <MDBCol md="4" className="gradient-custom text-center text-white"
                      style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                      <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                        alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                      <MDBTypography tag="h5">{fullName}</MDBTypography>
                      <MDBCardText>CS Undergraduate</MDBCardText>
                      {/* LinkContainer adds routing to the Edit Profile button. Sends the user to /userInfo */}
                      <LinkContainer to="/userInfo">
                        <MDBBtn outline color="light" style={{height: '36px', overflow: 'visible'}}>
                          Edit profile
                        </MDBBtn>
                      </LinkContainer> 
                    </MDBCol>
                    <MDBCol md="8">
                      <MDBCardBody className="p-4">
                        <MDBTypography tag="h6">Information</MDBTypography>
                        <hr className="mt-0 mb-4" />
                        <MDBRow className="pt-1">
                          <MDBCol size="6" className="mb-3">
                            <MDBTypography tag="h6">Email</MDBTypography>
                            <MDBCardText className="text-muted">{email}</MDBCardText>
                          </MDBCol>
                          <MDBCol size="6" className="mb-3">
                            <MDBTypography tag="h6">Password</MDBTypography>
                            <MDBCardText className="text-muted">*********</MDBCardText>
                          </MDBCol>
                        </MDBRow>
                        <MDBTypography tag="h6">My Progress</MDBTypography>
                        <hr className="mt-0 mb-4" />
                        <MDBRow className="pt-1">
                          <MDBCol size="6" className="mb-3">
                            <MDBTypography tag="h6">Learn</MDBTypography>
                            <MDBProgress className="rounded" height='30'>
                            <MDBProgressBar striped animated width={learnPercentage} valuemin={0} valuemax={100}> {learnPercentage}% </MDBProgressBar>
                            </MDBProgress>
                            <MDBCardText style={{paddingTop:'20px'}}>{learnScore}/{learnMax} Questions Completed</MDBCardText>
                          </MDBCol>
                          <MDBCol size="6" className="mb-3">
                            <MDBTypography tag="h6">Game</MDBTypography>
                            <MDBProgress className="rounded" height='30'>
                            <MDBProgressBar striped animated width={gamePercentage} valuemin={0} valuemax={100}> {gamePercentage}% </MDBProgressBar>
                            </MDBProgress>  
                            <MDBCardText style={{paddingTop:'20px'}}>{gameScore}/{gameMax} Games Completed</MDBCardText>                      
                          </MDBCol>
                        </MDBRow>                    
                      </MDBCardBody>
                    </MDBCol>
                  </MDBRow>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
      </section>
      </div>
    );
  }
}