import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function TradQuestion({ qdata, num }) {
    const container = {
    display: "block",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingTop: "50px"

    };

    const heading = {
    fontFamily: "Gluten",
    color: "#2613fe",
    fontSize: "40px",
    paddingBottom: "50px",
    textDecorationLine: "underline"

    };

    const tabs = {
    fontFamily: "Gluten",
    color: "#2613fe"

    };

    const tab = {

    padding: "30px",
    boxShadow: "0 3px 10px rgba(0,0,0,.3)",
    fontFamily: "Gluten",
    marginBottom: "80px"

    };

    const list = {
    listStyleType: "circle",
    listStylePosition: "inside",
    display: "inline-block"
    };

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
        fetch("http://localhost:5000/updatescore", {
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
                answer:answer,
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

    return (
        <>
            <div style={spaceAfterQ}></div>
            {num}: {qdata.question}
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

export default TradQuestion;