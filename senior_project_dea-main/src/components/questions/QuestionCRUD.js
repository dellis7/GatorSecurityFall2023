import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import QuestionForm from "./QuestionForm";
import '../componentStyling/textStyling.css';

function QuestionCRUD() {
  const [questionsData, setQuestionData] = useState([]);

  const handleQuestionsData = (data) => {
    setQuestionData(data);
  };

  const retrieveQuestions = () => {
    fetch("http://localhost:5000/questions/get/all", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000/",
      },
      body: JSON.stringify({token: window.localStorage.getItem("token")}),
    })
      .then((res) => res.json())
      .then((data) => {
        handleQuestionsData(data.data);
      })
  };

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
