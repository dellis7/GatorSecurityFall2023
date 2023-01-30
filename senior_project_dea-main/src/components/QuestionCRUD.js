import React, { useState } from "react";

function QuestionCRUD() {
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [answer, setAnswer] = useState("");

  const handleQuestionChange = (value) => {
    setQuestion(value);
  };

  const handleTopicChange = (value) => {
    setTopic(value);
  };

  const handleTypeChange = (value) => {
    if (value === "1") {
      let array = [""];
      setOptions(array);
    } else if (value === "2") {
      let array = ["True", "False"];
      setOptions(array);
    } else {
      let array = ["", ""];
      setOptions(array);
    }

    setType(value);
  };

  const handleOptionsChange = (index, value) => {
    let newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAnswerChange = (value) => {
    setAnswer(value);
  };

  const handleAddOption = () => {
    setOptions((options) => [...options, ""]);
  };

  const handleRemoveOption = (value) => {
    let filter = options.filter((option, index) => index !== value);
    setOptions(filter);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/questions/create", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin":"*",
      },
      body: JSON.stringify({
        question: question,
        type: type,
        topic: topic,
        options: options,
        answer: answer,
      }),
    }).then((response) => {
      if(response.status === 500)
      {
        alert("Internal server error. Please try again")
      }
      else if (response.status === 422)
      {
        alert("Please ensure all fields are properly filled out and try again.")
      }
      else if (response.status === 201)
      {
        alert("Question has been added successfully.");
      }
    });
  };

  //CSS
  const container = {
    display: "block",
    mx: "auto",
    paddingTop: "50px",
  };

  const heading = {
    fontFamily: "Gluten",
    color: "#2613fe",
    fontSize: "40px",
    paddingBottom: "50px",
    textDecorationLine: "underline",
  };

  const text = {
    fontFamily: "Gluten",
    color: "#2613fe",
  };

  //This is what is rendered to the user
  return (
    <div className="container" style={container}>
      <h4 style={heading}>Add a New Question</h4>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label htmlFor="formQuestion" style={text}>
                Question
              </label>
              <textarea
                required
                className="form-control"
                id="formQuestion"
                rows="2"
                placeholder="Enter your question here"
                onChange={(e) => {handleQuestionChange(e.target.value);}}
              ></textarea>
            </div>
            <div
              className="form-group"
              style={{ textAlign: "left", marginTop: 10 }}
            >
              <label htmlFor="form-topic" style={text}>
                Topic
              </label>
              <select
                required
                className="form-select"
                id="form-topic"
                onChange={(e) => {handleTopicChange(e.target.value);}}
              >
                <option value="">
                  Choose a Topic
                </option>
                <option value="1">Input Validation</option>
                <option value="2">Encoding & Escaping</option>
                <option value="3">Cross-Site Scripting</option>
                <option value="4">SQL Injection</option>
                <option value="5">Cryptography</option>
                <option value="6">User Authentication</option>
              </select>
            </div>
            <div
              className="form-group"
              style={{ textAlign: "left", marginTop: 10 }}
            >
              <label htmlFor="form-type" style={text}>
                Type
              </label>
              <select
                className="form-select"
                id="form-type"
                required
                onChange={(e) => {handleTypeChange(e.target.value);}}
              >
                <option value="">
                  Choose Question Type
                </option>
                <option value="1">Text Response</option>
                <option value="2">True/False</option>
                <option value="3">Multiple Choice</option>
              </select>
            </div>
            {type === "3" && (
              <div
                className="form-group"
                style={{ textAlign: "left", marginTop: 10 }}
              >
                <div className="container">
                  <label style={text}>Enter your options below</label>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ marginLeft: 10 }}
                    onClick={() => {handleAddOption();}}
                  >
                    +
                  </button>
                </div>
                <div className="container">
                  {options.map((option, index) => (
                    <div key={index} className="row row-cols-2">
                      <div className="col-11">
                        <textarea
                          required 
                          className="form-control"
                          rows="1"
                          style={{ marginTop: 10 }}
                          value={option}
                          placeholder="Enter your option here"
                          onChange={(e)=>{handleOptionsChange(index, e.target.value);}}
                        >
                        </textarea>
                      </div>
                      {index >= 2 && (
                        <div className="col-1">
                          <button
                            required
                            type="button"
                            className="btn btn-danger btn-sm"
                            style={{ marginTop: 13 }}
                            onClick={() => {handleRemoveOption(index);}}
                          >
                            X
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div
              className="form-group"
              style={{ textAlign: "left", marginTop: 10 }}
            >
              <label htmlFor="form-answer" style={text}>
                Answer
              </label>
              <textarea
                className="form-control"
                rows="1"
                placeholder="Enter your solution to the question here"
                required
                onChange={(e)=>{handleAnswerChange(e.target.value);}}
              >
              </textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ marginTop: 20 }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default QuestionCRUD;
