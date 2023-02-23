import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function GameAdventurePage() {

    const [count, setCounter] = React.useState(0);
    const [gameQuestionData, setGameQuestionData] = React.useState('');
    const [CYOAQuestionData, setCYOAQuestionData] = React.useState('');

    //Loads the data from database once
    React.useEffect(()=> {

        const loadGame = async () => {
            
            //If gameQuestionData not loaded yet, get it from the DB
            if(gameQuestionData.length === 0) {
                const game = await getGameQuestion("1", setGameQuestionData);
            }
    
            //If gameQuestionData has been loaded
            if(gameQuestionData.length !== 0) {
                //If CYOAQuestionData has not been loaded, get it from the DB
                if(CYOAQuestionData.length === 0) {
                    const CYOA = await getCYOAQuestion(gameQuestionData.questionData[count], setCYOAQuestionData);
                }
            }
        }

        //Initial function call to load data
        loadGame();
    },[gameQuestionData, CYOAQuestionData, count])
    
    //Function that pulls gameQuestion data from backend
    const getGameQuestion = (topic_, setGameQuestionData_) => {

        fetch("http://localhost:5000/games/getByTopic/" + topic_, {
          method: "POST",
          crossDomain:true,
          headers:{
              "Content-Type":"application/json",
              Accept:"application/json",
              "Access-Control-Allow-Origin":"*",
          },
          body:JSON.stringify({}),
          }).then((res) => res.json())
          .then((data)=>{
            //console.log(data.data[0].questionData);
            setGameQuestionData_(data.data[0]);
            //console.log(data.data[0]);
        })
    }

    //Function that pulls CYOAQuestion data from backend
    const getCYOAQuestion = (questionNumber_, setCYOAQuestionData_) => {

        fetch("http://localhost:5000/games/cyoa/getById/" + questionNumber_, {
          method: "POST",
          crossDomain:true,
          headers:{
              "Content-Type":"application/json",
              Accept:"application/json",
              "Access-Control-Allow-Origin":"*",
          },
          body:JSON.stringify({}),
          }).then((res) => res.json())
          .then((data)=>{
            //console.log(data);
            setCYOAQuestionData_(data.data);
            //console.log(data.data)
        })
    }

    //Function to check if user has submitted correct answer or not
    async function submit1() {
        if (CYOAQuestionData.options[1] === CYOAQuestionData.answer) {
            alert("Correct!");
            //Increase counter to get to next question, Force update of page
        }
        else {
            alert("Incorrect!");
        }
    }

    //Function to check if user has submitted correct answer or not
    async function submit2() {
        if (CYOAQuestionData.options[2] === CYOAQuestionData.answer) {
            alert("Correct!");
            //Increase counter to get to next question, Force update of page
        }
        else {
            alert("Incorrect!");
        }
    }

    //Function to check if user has submitted correct answer or not
    async function submit3() {
        if (CYOAQuestionData.options[3] === CYOAQuestionData.answer) {
            alert("Correct!");
            //Increase counter to get to next question, Force update of page
        }
        else {
            alert("Incorrect!");
        }
    }

    //Function to check if user has submitted correct answer or not
    async function submit4() {
        if (CYOAQuestionData.options[4] === CYOAQuestionData.answer) {
            alert("Correct!");
            //Increase counter to get to next question, Force update of page
        }
        else {
            alert("Incorrect!");
        }
    }

    async function loadOptions() {

        //If CYOAQuestionData hasn't been loaded yet
        if(CYOAQuestionData.length === 0) {
            //Display loading page
            return <div>Loading...</div>;
        }

        //Dynamically render the user's answer options as buttons
        let options = [];
    
        for(let i = 0; i < CYOAQuestionData.options.length; i++) {
          //options.push(<button onClick={submit} type="button" className="btn btn-primary btn-lg btn-block">{CYOAQuestionData.options[i]}</button>)
        }

        //Return the options to load on the HTML page
        return options;
    }

    //If CYOAQuestionData hasn't been loaded yet
    if(CYOAQuestionData.length === 0) {
        //Display loading page
        return <div>Loading...</div>;
    }
    else {
        //HTML elements that will be rendered to page
        return (
            <div>
                {/* Template Picture */}
                <img src='https://mdbootstrap.com/img/new/slides/041.webp' className='img-fluid' alt='...' />
                
                {/* btn-block = List of buttons to represent options */}
                <div className="btn-block img-fluid shadow-4 d-grid gap-2 col-6 mx-auto justify-content-center">
                    <button onClick={submit1} type="button" className="btn btn-primary btn-lg btn-block">{CYOAQuestionData.options[1]}</button>
                    <button onClick={submit2} type="button" className="btn btn-primary btn-lg btn-block">Option 2</button>
                    <button onClick={submit3} type="button" className="btn btn-primary btn-lg btn-block">Option 3</button>
                    <button onClick={submit4} type="button" className="btn btn-primary btn-lg btn-block">Option 4</button>
                </div>
            </div>
        );
    }
}

export default GameAdventurePage;