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
                getGameQuestion("1", setGameQuestionData);
            }
    
            //If gameQuestionData has been loaded
            if(gameQuestionData.length !== 0) {
                //If CYOAQuestionData has not been loaded, get it from the DB
                if(CYOAQuestionData.length === 0) {
                    getCYOAQuestion(gameQuestionData.questionData[count], setCYOAQuestionData);
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

    //Function to update counter value
    const increase = () => {
        setCounter(count => count + 1)
    }

    //Function to check if user has submitted correct answer or not
    const submit = (index) => {
        //If option matches answer
        if (CYOAQuestionData.options[index] === CYOAQuestionData.answer) {
            //If this is not the last question
            if (gameQuestionData.questionData.length !== count + 1) {
                //Give correct alert to end-user, and update page to next question
                alert("Correct!");
                increase();
                getCYOAQuestion(gameQuestionData.questionData[count + 1], setCYOAQuestionData);
            }
            //Else this is the last question
            else {
                //Congratulate end-user, and redirect them to game selection page
                alert("Congratulations! You beat the game!");
                window.location.href="./game"
            } 
        }
        //Else option does not match, alert end-user incorrect
        else {
            alert("Incorrect!");
        }
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
                {/* Code to replace Template Picture when we add actual images to CYOAQuestionData objects */}
                {/* <img src={CYOAQuestionData.stimulus} className='img-fluid' alt='...' /> */}

                {/* Template Picture */}
                <img src='https://mdbootstrap.com/img/new/slides/041.webp' className='img-fluid' alt='...' />
                
                {/* btn-block - List of buttons to represent options */}
                <div className="btn-block img-fluid shadow-4 d-grid gap-2 col-6 mx-auto justify-content-center">
                {/* A loop that dynamically populates buttons with the current CYOAQuestionData options */}
                {CYOAQuestionData.options.map((option, index) => (
                    <div key={index}>
                        <button onClick={() => {submit(index)}} type="button" className="btn btn-primary btn-lg btn-block">{option}</button>
                    </div>
                ))}
                </div>
            </div>
        );
    }
}

export default GameAdventurePage;