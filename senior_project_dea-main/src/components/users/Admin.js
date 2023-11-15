import React from 'react';
import Table from 'react-bootstrap/Table';
import GetConfig from '../../Config.js';
import {CSVLink} from "react-csv";
import { LinkContainer } from 'react-router-bootstrap';
import "./css/tables.css"
import "./css/admin.css"

export default class Admin extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        allUsers: null
      };
    }
    componentDidMount(){
      //Function that pulls all user data from the backend
      fetch(GetConfig().SERVER_ADDRESS + "/users/allUsers", {
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
        //Set user retrieved to allUsers variable
        this.setState({allUsers: data});
      });

      //Function that pulls the total number of questions from the backend
      fetch(GetConfig().SERVER_ADDRESS + "/questions/getCount", {
        method: "POST",
        crossDomain:true,
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body:JSON.stringify({displayType:'learn'}),
      }).then((res)=>res.json())
      .then(data=>{
        //Set the total number of learn questions to learnQuestionCount
        this.setState({learnQuestionCount: data.data})
      });

      //Function that pulls the total number of questions from the backend
      fetch(GetConfig().SERVER_ADDRESS + "/questions/getCount", {
        method: "POST",
        crossDomain:true,
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body:JSON.stringify({displayType:'game'}),
      }).then((res)=>res.json())
      .then(data=>{
        //Set the total number of fill in the blank questions to gameQuestionCount
        this.setState({gameQuestionCount: data.data})
      });

      //Function that pulls the total number of games from the backend
      fetch(GetConfig().SERVER_ADDRESS + "/games/getCount", {
        method: "POST",
        crossDomain:true,
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body:JSON.stringify({}),
      }).then((res)=>res.json())
      .then(data=>{
        //Set the total number of game questions (except for Fill in the Blank Questions) to allGamesCount
        this.setState({allGamesCount: data.data})
      });
    }

    

    render(){
      if(this.state.allUsers == null){
        return <div></div>
      }

      let learnMax = this.state.learnQuestionCount;
      let gameMax = this.state.allGamesCount + this.state.gameQuestionCount;

      //Function that calculates the total learn questions played/total learn questions
      function createLearnView(user){
        let learnScore = user["learnscore"].length;
        let totalScore = ["Total Score: " + learnScore + "/" + learnMax + "\n", "\n"]
        return <th style={{whiteSpace:"pre-wrap", wordWrap:"break-word"}}>{totalScore}</th>
      }

      //Function that calculates the total game questions played/total game questions
      function createGameView(user){
        let gameScore = user["gamescore"].length;
        let totalScore = ["Total Score: " + gameScore + "/" + gameMax + "\n", "\n"]
        return <th style={{whiteSpace:"pre-wrap", wordWrap:"break-word"}}>{totalScore}</th>
      }

      if(this.state.allUsers.status === 403) {
        return (<>You are not authorized to access this page.</>)
      }

      const headerCSV = [
          {label: "First Name", key: "firstName"},
          {label: "Last Name", key: "lastName"},
          {label: "Email", key: "email"},
          {label: "Learn Score", key: "learnScore"},
          {label: "Game Score", key: "gameScore"}
      ];

      let userCSV = [];
      this.state.allUsers.map((user) => (
          userCSV.push({firstName: user["fname"], lastName: user["lname"], email: user["email"], learnScore: user["learnscore"].length, gameScore: user["gamescore"].length})
      ));
      userCSV.push({});
      userCSV.push({email: "Total Questions", learnScore: `${learnMax}`, gameScore: `${gameMax}`});

      const emptyspace = {
        marginTop: '20px',
        marginBottom: '20px'
      };

      const tlmargins = {
        marginTop: '2vw',
        marginLeft: '2vw'
      }

      return (
          <div>
            {/* Functionality to invite a student to a class */}
            <div className="tlmargins align-left flex-sa" style={{textAlign: 'left'}}>
              <div>
              <div style={{fontSize: '28px'}}>
                Invite Students!
              </div>
              <div className="flex-sb" style={{marginTop: '2vh', width: '25%'}}>
                <div style={{paddingLeft: '0.5vw'}}>Email</div>

                <div>
                  <label htmlFor="email"></label>
                  <input type="text" id="emails" name="emails" />
                </div>
                
              </div>
              {/* <div style={{paddingLeft: '5vw', fontSize: '10px', margin: '10px'}}>
                  -- Pro tip:  paste a list of emails separated
                  <br></br>
                  by commas to invite several students at once!
              </div> */}
              <div className="flex-sb" style={{marginTop: '4vh', width: '25%'}}>
                <div style={{paddingLeft: '0.5vw'}}>Class</div>

                <div>
                  <label htmlFor="class"></label>
                  <input type="text" id="class" name="class" />
                </div>
              </div>

              <div className="btn btn-primary blue btn-lg" style={{marginTop: '5vh'}}>
                  Submit
              </div>
              </div>

              <div>
                <div style={{fontSize: '28px'}}>
                  Add a Class!
                </div>

                <div className="flex-sb" style={{marginTop: '2vh', width: '25%'}}>
                  <div style={{paddingLeft: '0.5vw'}}>
                    Class Name
                  </div>

                  <div>
                    <label htmlFor="newclass"></label>
                    <input type="text" id="newclass" name="newclass" />
                  </div>
                </div>

                <div className="btn btn-primary blue btn-lg" style={{marginTop: '5vh'}}>
                  Submit
                </div>

              </div>
            </div>

            {/* Download Student Progress Data Button */}
            <div style={{textAlign: "left", float: 'left', marginTop: '7vh'}}>
                <CSVLink className="btn btn-primary orange btn-lg" headers={headerCSV} data={userCSV} filename={"gatorsecurity-student-progress.csv"} target="_blank" style={tlmargins}>
                    Download Student Progress Data
                </CSVLink>
            </div>

            {/* <LinkContainer to="/admin/classmanagement">
              <div style={{textAlign: "left"}}>
                <button className="btn btn-primary blue btn-lg" style={{margin: 10}}>
                    Class Management
                </button>
              </div>
            </LinkContainer> */}

            {/* <div style={emptyspace}></div> */}

            {/* Table that displays each individual user's data/scores */}
            <div className="table-container" style={{marginTop: '20vh'}}>
              <Table striped bordered hover classname="scrollable-table" 
                  style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                  <thead>
                      <tr>
                      <th>#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Class</th>
                      <th>Learn Sections</th>
                      <th>Game Sections</th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                      this.state.allUsers.map((user, index) => (
                          <tr key={user["email"]}>
                              <td>{index}</td>
                              <td>{user["fname"]}</td>
                              <td>{user["lname"]}</td>
                              <td>{user["email"]}</td>
                              <td>COP3400</td>
                              {createLearnView(user)}
                              {createGameView(user)}
                          </tr>
                      ))
                      }
                  </tbody>
              </Table>
            </div>
            {/* Functionalities to delete a class, remove a student from a class*/}
            <div>
              
            </div>
          </div>
      );
    }
    
}