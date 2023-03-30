import React, {useEffect, useState} from "react";
import MatchingCard from "./MatchingCard";
import arrayShuffle from "array-shuffle";


function Matching () {

    //These are hard-coded vocab words to test the functionality of the matching game. Further functionality will allow words to be pulled from the database
    const [vocab, setVocab] = useState([
        ["Anti-Virus", "Protects users from viruses, spyware, trojans, and worms"],
        ["Brute Force Attack", "Systematically trying a high volume of possible combinations of characters until the correct one is found"],
        ["Encryption", "Converting plain data into secret code with the help of an algorithm"],
        ["DDoS", "A flooding attack on a remote target(s), in an attempt to overload network resources and disrupt service"],
        ["Firewall", "A virtual perimeter around a network of workstations preventing viruses, worms, and hackers from penetrating"],
        ["Keylogger", "A kind of spyware software that records every keystroke made on a computer’s keyboard"]
    ]);

    //cards hold the current cards being used in the game
    const [cards, setCards] = useState([]);
    //choiceOne will hole the card object for the players first choice
    const [choiceOne, setChoiceOne] = useState(null);
    //choiceTwo will hole the card object for the players second choice
    const [choiceTwo, setChoiceTwo] = useState(null);
    //diabled will allow for the selection of cards to be disabled when the players selections are being compared
    const [disabled, setDisabled] = useState(false);
    //numberCorrect will track how many times the user correctly answers cards
    const [numCorrect, setNumCorrect] = useState(0);

    //set the choices equal to the card object the user chooses depending on which choice it is
    const handleChoice = (card) => {
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }

    //starts a new game; used with "new game" button
    const newGame = () => {
        resetChoices();
        generateCards();
    }

    //this function generates a randomized subset of cards based on the input vocab set
    const generateCards = () => {
        //removed previous cards
        setCards([]);
        const tempCards = [];
        //generates randomized subset
        const cardSubset = arrayShuffle(vocab).slice(0,4);
        //splits definitions from keywords
        cardSubset.map((each, index) => {
            const temp1 = {
                val: index,
                text: each.at(0),
                matched: false
            }
            const temp2 = {
                val: index,
                text: each.at(1),
                matched: false
            }
            tempCards.push(temp1);
            tempCards.push(temp2);
        })
        //randomizes the cards
        const temp = arrayShuffle(tempCards);
        setCards(temp);
    }

    //resets choice states after two cards have been chosen and evaluated
    const resetChoices = () => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setDisabled(false);
    }

    //generates cards when the vocab array is changed (unused now, but will be used when connected to database)
    useEffect(() => {
        generateCards();
    },[vocab]);

    //congratulates player after completing game (currently set at 4 correct cards)
    useEffect(() => {
        if(numCorrect === 4){
            alert("Great Work!");
        }
    }, [numCorrect]);

    //evaluates the players choices once two cards have been chosen
    useEffect(() => {
        if(choiceOne && choiceTwo){
            setDisabled(true);
            if(choiceOne.val === choiceTwo.val){
                console.log("Match!");
                resetChoices();
                const temp = cards.map(card => {
                    if(card.val === choiceOne.val){
                        return {...card, matched: true};
                    }
                    else{
                        return card;
                    }
                })
                setCards(temp);
                setNumCorrect(numCorrect + 1);
            }
            else{
                console.log("Do not match");
                //when the player is incorrect, the game will wait 1.5 seconds before flipping cards back over
                setTimeout(() => resetChoices(), 1500);
            }
        }
        console.log(cards);
    }, [choiceOne, choiceTwo]);

    return(
        <div className="container">
            <div className="row" style={{marginTop:50, justifyContent:"center"}}>
                <h1 style={{color: "#113F67"}}>Memory Matching</h1>
                <button className="btn btn-primary" style={{maxWidth: 150, marginTop: 25}} onClick={newGame}>New Game</button>
            </div>
            <div className="row" style={{marginTop: 50}}>
            {cards.map((card, index) => (
                <div key={index} className="col-3" style={{display: "flex", justifyContent:"center"}}>
                <MatchingCard
                    card={card}
                    handleChoice={handleChoice}
                    flipped={card === choiceOne || card === choiceTwo || card.matched}
                    disabled={disabled}
                />
                </div>
            ))}
            </div>
        </div>
    );
}
export default Matching;