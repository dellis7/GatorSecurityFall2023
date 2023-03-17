import React, {useEffect, useState} from "react";
import MatchingCard from "./MatchingCard";
import arrayShuffle from "array-shuffle";


function Matching () {

    const [vocab, setVocab] = useState([
        ["Anti-Virus", "Protects users from viruses, spyware, trojans, and worms"],
        ["Brute Force Attack", "Systematically trying a high volume of possible combinations of characters until the correct one is found"],
        ["Encryption", "Converting plain data into secret code with the help of an algorithm"],
        ["DDoS", "A flooding attack on a remote target(s), in an attempt to overload network resources and disrupt service"],
        ["Firewall", "A virtual perimeter around a network of workstations preventing viruses, worms, and hackers from penetrating"],
        ["Keylogger", "A kind of spyware software that records every keystroke made on a computer’s keyboard"]
    ]);

    const [cards, setCards] = useState([]);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [numCorrect, setNumCorrect] = useState(0);

    const handleChoice = (card) => {
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }

    const newGame = () => {
        resetChoices();
        generateCards();
    }

    const generateCards = () => {
        setCards([]);
        const tempCards = [];
        const cardSubset = arrayShuffle(vocab).slice(0,4);
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
        const temp = arrayShuffle(tempCards);
        setCards(temp);
        console.log(cards);
    }

    const resetChoices = () => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setDisabled(false);
    }

    useEffect(() => {
        generateCards();
    },[vocab]);

    useEffect(() => {
        if(numCorrect === 4){
            alert("Great Work!");
        }
    }, [numCorrect]);

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