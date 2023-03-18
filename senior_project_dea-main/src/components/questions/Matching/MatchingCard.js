import React, {useEffect, useState} from "react";
import gator from "../../../images/gator.png"
import './MatchingCard.css'


export default function MatchingCard( {card, handleChoice, flipped, disabled} ) {


    function handleClick(){
        if(!disabled){
            handleChoice(card);
        }
    }

    return (
        /*
        <div className="col">
            {!flipped &&(
                <div className="card m-4"style={{width:200, height:200, justifyContent:"center", backgroundImage: "linear-gradient(#0A2647, #2C74B3)"}}>
                    <img className="card-img" src={gator} alt="gator logo" onClick={handleClick}/>
                </div>
            )}
            {flipped && (
                <div className="card m-4" style={{width:200, height:200, backgroundColor: "#EEEEEE"}}>
                    <div className="card-body d-flex" style={{justifyContent:"center", alignItems:"center"}}>
                        <p style={{maxWidth: 180}}>
                            {card.text}
                        </p>
                    </div>

                </div>
            )}
        </div>
         */
        <div className="card matchCard" style={{minWidth:200, minHeight:200, marginBottom: 50}}>
            <div className={flipped ? "flipped" : ""}>
                <div className="back" onClick={handleClick} style={{width:200, height:200, display:"flex", alignItems:"center"}}>
                    <img src={gator} alt="gator logo" style={{width:"100%"}}/>
                </div>

                <div className="front" style={{minWidth:200, minHeight:200, display: "flex", justifyContent:"center", alignItems:"center"}}>
                    <p style={{maxWidth: 180, }}>
                        {card.text}
                    </p>
                </div>

            </div>
        </div>
    );
}