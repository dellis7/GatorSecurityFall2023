import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import QuestionForm from "./QuestionForm";
import GetConfig from '../../Config';
import '../componentStyling/textStyling.css';

function QuestionCRUD() {

  //this state holds the data of questions pulled from the database
  const [questionsData, setQuestionData] = useState([]);

  //this function sets the question data
  const handleQuestionsData = (data) => {
    setQuestionData(data);
  };

  //this function retrieves question data from the database
  const retrieveQuestions = () => {
    fetch(GetConfig().SERVER_ADDRESS + "/questions/get/all", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body: JSON.stringify({token: window.localStorage.getItem("token")}),
    })
      .then((res) => res.json())
      .then((data) => {
        handleQuestionsData(data.data);
      })
  };

  //question data is retrieved automatically on initial load of page
  useEffect(() => {
    retrieveQuestions();
  });

  //CSS
  const container = {
    mx: "auto",
    paddingTop: "50px",
  };

  //This is what is rendered to the user
  return (
    <div className="container" style={container}>
      <h1 className='h1-text'>Add a New Question</h1>
      <QuestionForm />
      <div style={{ marginTop: 100 }}>
        <h1 className='h1-text'>Existing Questions</h1>
      </div>
      <div className="container">
        {questionsData.map((entry, index) => (
          <QuestionCard
            key={index}
            question_Card={entry.question}
            topic_Card={entry.topic}
            type_Card={entry.type}
            options_Card={entry.options}
            answer_Card={entry.answer}
            id_Card={entry._id}
            displayType_Card={entry.displayType}
          />
        ))}
      </div>
    </div>
  );
}

export default QuestionCRUD;
