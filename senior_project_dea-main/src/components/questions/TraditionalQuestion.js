import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function TradQuestion({ qdata, num }) {

    const spaceAfterQ = {
    paddingTop: "10px"
    }

    const [answer, setSelection] = React.useState('');
    const onChange = e => {
      setSelection(e.target.value)
    }

    const createAnswerOptions = (type) => {
        var answerOptions = [];

        for(let i = 0; i < qdata.options.length; i++) {
            answerOptions.push((
            <>
                <Form.Check id={qdata._id + "_" + toString(i)}
                    inline
                    label={qdata.options[i]}
                    value={qdata.options[i]}
                    name={"answer_" + qdata._id}
                    type={type}
                    onChange={onChange}
                />
            </>   
            ));
        }
        return answerOptions;
    }

    const checkAnswer = () => {
        var theAnswer = answer;
        if(qdata.type === 1) {
            theAnswer = document.getElementById("answer-box-" + qdata._id).value;
        }
        fetch("http://localhost:5000/users/updatelearnscore", {
            method: "PUT",
            crossDomain:true,
            headers:{
                "Content-Type":"application/json",
                Accept:"application/json",
                "Access-Control-Allow-Origin":"*",
            },
            body:JSON.stringify({
                token:window.localStorage.getItem("token"),
                qid:qdata._id,
                answer:theAnswer,
            }),
        }).then((res)=>res.json())
        .then((data)=>{
            if(data.data.correct === true) {
                alert("Correct!");
            }
            else {
                alert("Incorrect. Try again!");
            }
        })
    }

    //Display T/F and MC questions
    if(qdata.type === 2 || qdata.type === 3) {
        return (
            <>
                <div style={spaceAfterQ}></div>
                {num}. {qdata.question}
                <div style={spaceAfterQ}></div>
                <div>
                    <Form>
                    {['radio'].map((type) => (
                        <div className="mb-4">
                        <Form.Group>
                            {createAnswerOptions(type)}
                        </Form.Group>                  
                        </div>
                    ))}
                    </Form>
                    <Button type="submit" onClick={checkAnswer}>Submit</Button>
                    <div style={spaceAfterQ}></div>
                    <div style={spaceAfterQ}></div>
                    <div style={spaceAfterQ}></div>
                    You selected: <strong>{answer}</strong>
                    <div style={spaceAfterQ}></div>
                    <div style={spaceAfterQ}></div>
                    <div style={spaceAfterQ}></div>
                    <div style={spaceAfterQ}></div>
                </div>
            </>
        );
    }
    //Display typed answer questions
    else {
        return (
            <>
                <div style={spaceAfterQ}></div>
                {num}. {qdata.question}
                <div style={spaceAfterQ}></div>
                <div>
                    <div id={"answer-container-" + qdata._id}>
                        <input type="text" placeholder="Enter your answer here..." id={"answer-box-" + qdata._id}></input>
                        <button className="button" onClick={checkAnswer}>Submit</button>
                    </div>
                    <div style={spaceAfterQ}></div>
                    <div style={spaceAfterQ}></div>
                    <div style={spaceAfterQ}></div>
                    <div style={spaceAfterQ}></div>
                </div>
            </>
        );
    }
}

export default TradQuestion;