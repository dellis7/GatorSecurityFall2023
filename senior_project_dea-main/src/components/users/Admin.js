import React from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form'
import GetConfig from '../../Config.js';
import {CSVLink} from "react-csv";
import { LinkContainer } from 'react-router-bootstrap';
import "./css/tables.css"
import "./css/admin.css"
import "./css/inputs.css"
import "./css/debug.css"
import apiRequest from '../../util/api.js';


export default class Admin extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        userInfo: null,
        allUsers: null,
        accountTypes: null,
        canEdit: false,
        studentEmail: "",
        cname: "",
        inviteClass:"",
        email:"",
        myStudents:[{email: "You have no students!", className: "N/A"}],
        myClasses:[{id: '0', className: 'You have no classes!'}],
        currentClass: null

        // These are examples of how the myStudents and myClasses data is structured.
        // myClasses: [{id: '1', className: 'COP1000'},
        //             {id: '2', className: 'COP2000'},
        //             {id: '3', className: 'COP3000'} ],
        // myStudents: [{email: 'EXAMPLE1@EX.COM', name: 'EXAMPLE1 JR.', class: 'COP1000'},
        //              {email: 'EXAMPLE2@EX.COM', name: 'EXAMPLE2 JR.', class: 'COP2000'}],
      };
      this.handleSubmitAddClass = this.handleSubmitAddClass.bind(this);
      this.handleSubmitAddStudent = this.handleSubmitAddStudent.bind(this);
      this.handleSubmitRemoveClass = this.handleSubmitRemoveClass.bind(this);
      // this.handleGatherClassStudents = this.handleGatherClassStudents.bind(this);
    }

    componentDidMount(){

      //Function that pulls the current user's profile info from the backend
      apiRequest("/users/userInfo").then((res)=>res.json())
          .then(data=>{
              //Set userInfo with data retrieved from backend
              this.setState({userInfo: data.data.dbUserData});
          });

      //Function that pulls all user data from the backend
      apiRequest("/users/allUsers").then((res)=>res.json())
      .then(data=>{
        //Set user retrieved to allUsers variable
        this.setState({allUsers: data});
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
      apiRequest("/users/getAccountTypes").then((res) => res.json())
        .then(data => {
          //Set user retrieved to allUsers variable
          this.setState({ accountTypes: data });
        });
      //Function that pulls the total number of questions from the backend
      apiRequest("/users/checkPrivileges").then((res) => res.status === 200)
        .then(status => {
          //Set user retrieved to allUsers variable
          this.setState({ canEdit: status.toString() });
        });
      
      //Function that pulls all the teacher's classes
      apiRequest("/classes/getAllClasses", {
          method: "POST",
        }).then((res) => res.json())
        .then(data=>{
        //Set user retrieved to myClasses variable
            this.setState({myClasses: data});

        }).then(() => {
            if (this.state.myClasses == null){
                this.setState({myClasses: [{id: '0', className: 'You have no classes!'}]})
                this.setState({myStudents: {email: "You have no students!", className: "N/A"}});
            }
            else {
                let students = [];
                let id = 0;
                this.state.myClasses.map((eachClass) => {
                    if (eachClass.students != null) {
                        for (let i = 0; i < eachClass.students.length; i++) {
                            let student = {};
                            student.email = eachClass["students"][i]
                            student.className = eachClass["name"];
                            student.key = id;
                            students[id++] = student;
                        }
                    }
                        this.setState({myStudents: students})
                    }
                )
            }
      })
      ;

      //Function that pulls all the teacher's students
      // apiRequest("API_ENDPOINT", {
      //     method: "POST",
      //     }
      //   ).then((res)=>res.json())

      //   .then(data=>{
      //       //Set user retrieved to myStudents variable
      //       this.setState({myStudents: data});
      // });
    }

    //Inviting students or adding a new class
    handleSubmitAddClass(e) {
        //Needed for Mozilla Firefox. Without it, forms won't be properly submitted to the backend.
        e.preventDefault();

        const cname = this.state.cname
        const educatorEmail = this.state.userInfo["email"]

        //Function that registers the user in the backend
        apiRequest("/classes/createClass", {
            method: "POST",
            body:JSON.stringify({
                cname,
                educatorEmail
            }),
        }).then((res)=>res.json())
            .then((data)=>{
                if(data.status==="ok"){
                    alert("Class Created!");
                    window.location.href="./admin"
                }
                else if (data.status==="classExists"){
                    alert("This class name already exists!")
                }
            })
    }

    //Remove class (current user must own class)
    handleSubmitRemoveClass(classInfo){
        //Needed for Mozilla Firefox. Without it, forms won't be properly submitted to the backend.
        // e.preventDefault();

        const cname = classInfo.name;
        const educatorEmail = this.state.userInfo["email"]

        //Function that removes class from backend
        apiRequest("/classes/removeClass", {
            method: "DELETE",
            body:JSON.stringify({
                cname,
                educatorEmail
            }),
        }).then((res)=>res.json())
            .then((data)=>{
                if(data.status==="ok"){
                    alert("Class Deleted!");
                    window.location.href="./admin"
                }
                else if (data.status==="noSuchClass"){
                    alert("This class name doesn't exist!")
                }
                else if (data.status==="notClassOwner"){
                    alert("You aren't this class's owner!")
                }
            })
    }

    handleSubmitAddStudent(e){
        //Needed for Mozilla Firefox. Without it, forms won't be properly submitted to the backend.
        e.preventDefault();

        const studentEmail = this.state.studentEmail;
        const className = this.state.inviteClass;
        const educatorEmail = this.state.userInfo["email"]

        apiRequest("/classes/addStudent", {
            method: "POST",
            crossDomain:true,
            body:JSON.stringify({
                studentEmail,
                className,
                educatorEmail
            }),
        }).then((res)=>res.json())
            .then((data)=>{
                if(data.status==="ok"){
                    alert(studentEmail + " added to class " + className);
                    window.location.href="./admin"
                }
                else if (data.status==="noSuchStudent"){
                    alert("This student doesn't exist!")
                }
                else if (data.status==="noSuchClass"){
                    alert("You don't own a class with this name!")
                }
            });
    }

    async handleChangeAccountType(user, event) {
    
      this.value = event.target.value;
      console.log(event)
      let res = await apiRequest(`/users/update/${user}`, {
        method: "PUT",
        body: JSON.stringify(

          { "accountType": event.target.value }
        ),
      }).then((res) => res);
      if (res.status == 202) {
        alert("Update Successful");
      }
      else {
        alert("Update Failed")
      }
  }

    handleSubmitRemoveStudent(student){
        apiRequest("/classes/removeStudent", {
            method: "POST",
            body: JSON.stringify({
                studentEmail: student.email,
                className: student.className
            })
        })
        window.location.href = "./admin";
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

      // const self = this;
      // //Function to handle selecting a class from your list of classes
      // function selectClass(classInfo){
      //   self.setState({currentClass: classInfo.name});
      //   self.handleGatherClassStudents(classInfo);
      //
      // }

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
            <div className="tlrmargins align-left flex-sa" style={{textAlign: 'left'}}>
              <div className='form-a' style={{width: '25vw', borderRadius: '15px', padding: '1vh'}}>
              <form onSubmit={this.handleSubmitAddStudent}>
              <div style={{fontSize: '28px', marginLeft: '5vw'}}>
                Invite Students!
              </div>
              <div className="flex-sb" style={{marginTop: '2vh', width: '25%'}}>
                <div style={{paddingLeft: '0.5vw'}}>Email</div>

                <div>
                  <label htmlFor="email"></label>
                  <input type="text" id="emails" name="emails"
                         placeholder={"Email to Invite"}
                         onChange={e=>this.setState({studentEmail:e.target.value})}
                  />
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
                  <input type="text" id="class" name="class"
                         placeholder={"Name of Class"}
                         onChange={e=>this.setState({inviteClass:e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary blue btn-lg" style={{marginTop: '5vh', marginLeft: '15vw'}}>
                  Submit
              </button>
              </form>
              </div>

              <div className="form-b" style={{width: '25vw', padding: '2vh'}}>
                <form onSubmit={this.handleSubmitAddClass}>
                    <div style={{fontSize: '28px', paddingLeft: '5.5vw'}}>
                      Add a Class!
                    </div>

                    <div className="flex-sb" style={{marginTop: '2vh', width: '25%'}}>
                      <div style={{paddingLeft: '0.5 vw'}}>
                        Class Name
                      </div>

                      <div>
                        <label htmlFor="newclass"></label>
                        <input type="text" id="newclass" name="newclass"
                               placeholder={"Enter new class name"}
                               onChange={e=>this.setState({cname:e.target.value})}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary blue btn-lg" style={{marginTop: '10vh', marginLeft: '15vw'}}>
                        Submit

                    </button>
                </form>

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
              <Table striped bordered hover className="scrollable-table" 
                  style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                  <thead>
                      <tr>
                      <th>#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      {/*<th>Class</th>*/}
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
                              {/*<td>COP3400</td>*/}
                              {createLearnView(user)}
                              {createGameView(user)}
                              {
                                this.state.canEdit && this.state.accountTypes !== null ? <td>
                                  <Form.Select aria-label="Account Type" defaultValue={user["accountType"]} onChange={async (event) => this.handleChangeAccountType(user["_id"], event)}>
                                    {this.state.accountTypes.map((type, index) => <option key={index} value={type}>{type}</option>)}
                                  </Form.Select>
                                </td>
                                  :
                                  <td>{user["accountType"]}</td>
                              }
                              {/* <td>
                                <button onClick={() => handleDeleteUser(user.email)}>
                                  Delete
                                </button>
                              </td> */}
                          </tr>
                      ))
                      }
                  </tbody>
              </Table>
            </div>
            {/* Functionalities to delete a class, remove a student from a class*/}
            <div>
              <h2 style={{marginTop: '5vh'}}>All of Your Classes</h2>
              <div className="table-container" style={{marginTop: '10vh'}}>
                <Table striped bordered hover className="scrollable-table" style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Class Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.myClasses.map((classInfo, index) => (
                      <tr key={classInfo.id}>
                        <td>{index}</td>
                        <td>{classInfo.name}</td>
                        <td>
                          <button onClick={() => this.handleSubmitRemoveClass(classInfo)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>

            <h2 style={{marginTop: '5vh'}}>All of Your Students</h2>
            <div className="table-container" style={{marginTop: '10vh'}}>
                <Table striped bordered hover className="scrollable-table" style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Email</th>
                      <th>Class</th>
                        <th>Remove Student</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.myStudents.map((student, index) => (
                      <tr key={index}>
                          <td>{index}</td>
                          <td>{student.email}</td>
                          <td>{student.className}</td>
                          <td>
                              <button onClick={() => this.handleSubmitRemoveStudent(student)}>
                                  Remove
                              </button>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
          </div>
      );
    }
    
}