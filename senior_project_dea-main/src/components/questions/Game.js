import React from 'react';
import '../componentStyling/buttons.css';
import '../componentStyling/textStyling.css';
import '../componentStyling/Game.css';

function GamePage() {
    const [cyoaGameQuestions, setCYOAGameQuestions] = React.useState('');
    const [dndGameQuestions, setDNDGameQuestions] = React.useState('');

        //Loads the data from database once
        React.useEffect(()=> {

            const loadGames = async () => {

                if(cyoaGameQuestions.length === 0) {
                    getGameQuestionsByType("0", setCYOAGameQuestions);
                }
                if(dndGameQuestions.length === 0) {
                    getGameQuestionsByType("1", setDNDGameQuestions);
                }
            }
    
            //Initial function call to load data
            loadGames()
        },[cyoaGameQuestions, dndGameQuestions])

    const getGameQuestionsByType = (type_, setGameQuestionData_) => {
        fetch("http://localhost:5000/games/getByType/" + type_, {
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
            setGameQuestionData_(data);
        })
    }

    const spaceAfterQ = {
        paddingTop: "10px"
    }

    var cyoaQuestionDisplay = [];

    if(cyoaGameQuestions.length !== 0) {
        for(let i = 0; i < cyoaGameQuestions.data.length; i++) {
            cyoaQuestionDisplay.push(
                <div key={i}>
                    <a href={`./gameAdventure/${cyoaGameQuestions.data[i]._id}`} className="btn btn-primary">
                          {cyoaGameQuestions.data[i].name}
                    </a>
                    <div style={spaceAfterQ} />
                </div>
            );
        }
    }

    var dndQuestionDisplay = [];

    if(dndGameQuestions.length !== 0) {
        for(let i = 0; i < dndGameQuestions.data.length; i++) {
            dndQuestionDisplay.push(
                <div key={i}>
                    <a href={`./gameDND/${dndGameQuestions.data[i]._id}`} className="btn btn-primary">
                        {dndGameQuestions.data[i].name}
                    </a>
                    <div style={spaceAfterQ} />
                </div>
            );
        }
    }

    return (
      <div>
          <div className='card-container game'>
            <div className='card game'>
                <img src="./pexels-pixabay-207580.jpg" className='img-size' alt="Bright Business Code"/>
                <div className="card-body">
                    <h5 style={{"fontWeight": 'bold'}}>
                        Choose Your Own Adventure Games
                    </h5>
                    <p className="card-text">
                        Select a choose your own adventure game to play below.
                        <br></br>
                        (Photo by <a href="https://www.pexels.com/@pixabay/" className='link-text'>Pixabay</a> on <a href="https://www.pexels.com/photo/blur-bright-business-codes-207580/" className='link-text'>Pexels)</a>
                    </p>
                    {cyoaQuestionDisplay}
                </div>
            </div>
            <div className='card game'>
                <img src="./DND.png" className='img-size' alt="Neon Lock"/>
                <div className="card-body">
                    <h5 style={{"fontWeight": 'bold'}}>
                        Drag and Drop Games
                    </h5>
                    <p className="card-text">
                        Select a drag and drop game to play below.
                        <br></br>
                        (Photo by Professor Resch (This is a template))
                    </p>
                    {dndQuestionDisplay}
                </div>
            </div>
            <div className='card game'>
                <img src="./artificial-intelligence-gf9b982dc3_1920.jpg" className='img-size' alt="Blue Digital Human Head"/>
                <div className="card-body">
                    <h5 style={{"fontWeight": 'bold'}}>
                        Memory Matching Card Games
                    </h5>
                    <p className="card-text">
                        Select a memory matching card game to play below.
                        <br></br>
                        (Photo by <a href="https://pixabay.com/users/geralt-9301/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3706562" className='link-text'>Gerd Altmann</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3706562" className='link-text'>Pixabay</a>)
                    </p>
                    <a href="./gameMatching" className="btn btn-primary">
                        Cybersecurity Terms and Definitions
                    </a>
                </div>
            </div>
            <div className='card game'>
                <img src="./kvalifik-3TiNowmZluA-unsplash.jpg" className='img-size' alt="Edgy Blue Computer Monitor"/>
                <div className="card-body">
                    <h5 style={{"fontWeight": 'bold'}}>
                        Fill in the Blank Games
                    </h5>
                    <p className="card-text">
                        This will take you to the fill in the blank games page.
                        <br></br>
                        (Photo by <a href="https://unsplash.com/@kvalifik?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" className='link-text'>Kvalifik</a> on <a href="https://unsplash.com/photos/3TiNowmZluA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" className='link-text'>Unsplash)</a>
                    </p>
                    <a href="./gameTraditional" className="btn btn-primary">
                        Fill in the Blank Games
                    </a>
                </div>
            </div>
            </div>
        </div>
    );
  }
  
  export default GamePage;