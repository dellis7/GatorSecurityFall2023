import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import arrayShuffle from "array-shuffle";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";


//Temporary Data set to work on functionality; will be replaced by backend support
const questions = [
    {
        parentQuestionId: "1234567890",
        question: "Asymmetric encryption, also known as public-key encryption, is a type of encryption algorithm that uses a pair of keys (public and private) to encrypt and decrypt data. The image provided is a flow chart showcasing the process of asymmetric encryption. As you can see the steps seem to have been mixed up. Rearrange the list so that it follows steps 1-5 in the correct order.",
        options: [
            "Plaintext Data",
            "Public Key",
            "Ciphered Data",
            "Private Key",
            "Decrypted Plaintext Data"
          ],
    },
    {
        parentQuestionId: "9876543210",
        quetion: "This is a test",
        options: [
            "I",
            "Am",
            "An",
            "Ali",
            "Gator"
          ],
    },
]


function DragNDrop() {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questionData, setQuestionData] = useState(questions.at(currentQuestion));
    const [dndOptions, setDndOptions] = useState(arrayShuffle(questionData.options));
    
    useEffect(() => {
        setQuestionData(questions.at(currentQuestion));
    }, [currentQuestion])

    useEffect(() => {
        setDndOptions(arrayShuffle(questionData.options));
    }, [questionData.options])


      return (
        <div className="Container">
          <div
            className="row col-lg-auto"
            style={{ justifyContent: "center", marginTop: 50 }}
          >
            <div className="col-12 col-md-5">
                        <img
                        src={`http://localhost:5000/uploads/cyoa/${questionData.parentQuestionId}.png`}
                        alt="Depiction of asymmetric encryption"
                        style={{ width: "100%", maxWidth: "700px" }}
                      />
              <p className=" px-3 px-md-0" style={{ marginTop: 20, textAlign: "left"}}>
                {questionData.question}
              </p>
            </div>
    
            <div className="col-12 col-md-5">
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <Container
                  className="col-10 col-md-10 col-lg-8"
                  style={{ marginTop: 50 }}
                  align="center"
                >
                  <SortableContext
                    items={dndOptions}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="card body">
                      {/* We need components that use the useSortable hook */}
                      {dndOptions.map((language) => (
                        <SortableItem key={language} id={language} />
                      ))}
                    </div>
                  </SortableContext>
                </Container>
              </DndContext>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ marginTop: 20, width: 125 }}
                onClick={() => {
                  checkAnswer();
                }}
              >
                Check
              </button>
            </div>
          </div>
        </div>
      );

      function handleDragEnd(event) {
        const { active, over } = event;
    
        if (active.id !== over.id) {
          setDndOptions((items) => {
            const activeIndex = items.indexOf(active.id);
            const overIndex = items.indexOf(over.id);
            return arrayMove(items, activeIndex, overIndex);
            // items: [2, 3, 1]   0  -> 2
            // [1, 2, 3] oldIndex: 0 newIndex: 2  -> [2, 3, 1]
          });
        }
      }
    
      function checkAnswer(props) {
        if (questionData.options.every((val, index) => val === dndOptions[index])) {
            //Update the user's score via HTTP request
            fetch("http://localhost:5000/users/updateScore", {
              method: "POST",
              crossDomain:true,
              headers:{
                  "Content-Type":"application/json",
                  Accept:"application/json",
                  "Access-Control-Allow-Origin":"*",
              },
              body:JSON.stringify({
                  token:window.localStorage.getItem("token"),
                  //TODO - Replace 1234567890 with the parent game question id when DragNDrop page is made dynamic
                  qid: 1234567890 
              }),
          }).then((res) => {
              if(res.status === 204) {
                  alert("Great Work!");
                  incrementQuestion();
              }
              else {
                  alert("Something went wrong with the backend!");
              }
          })

        } else {
          alert("Keep trying!");
        }
      }

      function incrementQuestion(){
            setCurrentQuestion(currentQuestion + 1);
            if(currentQuestion + 1 >= questions.length){
                window.location.href="/game";
            }
      }
}

function SortableItem(props) {
      
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className="card m-3">
                <div className="card-body">
                {props.id}
                </div>
            </div>
            
        </div>
    )
  }

export default DragNDrop;