import React from 'react';
import Table from 'react-bootstrap/Table';

export default class Admin extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        allUsers: null
      };
    }
    componentDidMount(){
      fetch("http://localhost:5000/users/allUsers", 
        {
          method: "POST",
          crossDomain:true,
          headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({
          token:window.localStorage.getItem("token"),
        }),
        }).then((res)=>res.json())
        .then(data=>{
            //console.log("data: ")
            //console.log(data)
          this.setState({allUsers: data});
        });
        fetch("http://localhost:5000/questions/getCount", 
        {
          method: "POST",
          crossDomain:true,
          headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({displayType:'learn'}),
        }).then((res)=>res.json())
        .then(data=>{
          this.setState({learnQuestionCount: data.data})
        });
        fetch("http://localhost:5000/questions/getCount", 
        {
          method: "POST",
          crossDomain:true,
          headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({displayType:'game'}),
        }).then((res)=>res.json())
        .then(data=>{
          this.setState({gameQuestionCount: data.data})
        });
        fetch("http://localhost:5000/games/getCount", 
        {
          method: "POST",
          crossDomain:true,
          headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({}),
        }).then((res)=>res.json())
        .then(data=>{
          this.setState({allGamesCount: data.data})
        });
    }
    render(){
        //console.log("all users:")
        //console.log(this.state.allUsers);
      if(this.state.allUsers == null){
        return <div></div>
      }
      var learnMax = this.state.learnQuestionCount;
      var gameMax = this.state.allGamesCount + this.state.gameQuestionCount;
      function createLearnView(user){
        var learnScore = user["learnscore"].length;
        var totalScore = ["Total Score: "+learnScore+"/"+learnMax+"\n","\n"]
        return <th style={{whiteSpace:"pre-wrap", wordWrap:"break-word"}}>{totalScore}</th>
      }
      function createGameView(user){
        var gameScore = user["gamescore"].length;
        var totalScore = ["Total Score: "+gameScore+"/"+gameMax+"\n","\n"]
        return <th style={{whiteSpace:"pre-wrap", wordWrap:"break-word"}}>{totalScore}</th>
      }

      if(this.state.allUsers.status === 403) {
        return (<>You are not authorized to access this page.</>)
      }

      return (
        <Table striped bordered hover>
            <thead>
                <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Learn Sections</th>
                <th>Game Sections</th>
                </tr>
            </thead>
            <tbody>
                {
                this.state.allUsers.map((user, index) => (
                    <tr>
                        <td>{index}</td>
                        <td>{user["fname"]}</td>
                        <td>{user["lname"]}</td>
                        <td>{user["email"]}</td>
                        {createLearnView(user)}
                        {createGameView(user)}
                    </tr>
                ))
                }
            </tbody>
        </Table>

      );
    }
    
}