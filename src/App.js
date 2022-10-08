import React from 'react';
import { nanoid } from 'nanoid';
import Question from './Componants/Question';

const App = () => {
  const [questions, setQuestions] = React.useState();
  const [start, setStart] = React.useState(false);
  const [answers, setAnswers] = React.useState([]);
  const [selected, setSelected] = React.useState(false);
  const [finish, setFinish] = React.useState(false);
  let [score, setScore] = React.useState(0);

  React.useEffect(() => {
    if (start) {
      async function getApiData() {
        try {
          const respose = await fetch('https://opentdb.com/api.php?amount=10');
          const data = await respose.json();
          const finalData = data.results.map(data => {
            const options = [
              ...data.incorrect_answers,
              data.correct_answer,
            ].map(option => {
              return {
                id: nanoid(),
                answer: option,
                isSelected: false,
                isCorrect: undefined,
              };
            });
            return {
              id: nanoid(),
              question: data.question,
              options,
              correct_answer: data.correct_answer,
            };
          });
          const newArr = [];
          for (let i = 0; i < 5; i++) {
            newArr.push(finalData[i]);
          }
          return setQuestions(newArr);
        } catch (error) {
          console.log(error);
        }
      }
      getApiData();
    }
  }, [start]);

  React.useEffect(() => {
    const newArr = [];
    questions?.forEach(question => {
      question.options.forEach(option => {
        if (option.isSelected && option.answer === question.correct_answer) {
          newArr.push({ answer: option.answer, isCorrect: true });
        } else if (
          option.isSelected &&
          option.answer !== question.correct_answer
        ) {
          newArr.push({ answer: option.answer, isCorrect: false });
        }
      });
      setSelected(true);
    });
    setAnswers(newArr);
  }, [questions]);

  //start quiz app.
  function startQuiz() {
    //change start state value to start quiz
    setStart(true);
  }

  //mapping questions throw component
  const questionElements = questions?.map(question => {
    return (
      <Question
        questionId={question.id}
        key={nanoid()}
        question={question}
        selectAnswers={selectAnswers}
        finish={finish}
      />
    );
  });

  console.log(questionElements);
  //select answers
  function selectAnswers(questionId, answerId) {
    setQuestions(prevQuestions => {
      //map over questions
      return prevQuestions.map(question => {
        //return question objects and looping through options
        return {
          ...question,
          options: question.options.map(option => {
            //check if both answerId and questionId selected
            if (option.id === answerId && question.id === questionId) {
              //then return previous not changing answer property
              //and change isSelected property to opposite
              return {
                ...option,
                isSelected: !option.isSelected,
                isCorrect: option.answer === question.correct_answer,
              };
            }

            //if user selected the answer we need to return the selected answer isSelected property before to false
            //to change it's selected color and also it's not accepted to choose more than one answer per question
            if (question.id === questionId) {
              return {
                ...option,
                isSelected: false,
              };
            }

            return option;
          }),
        };
      });
    });
  }

  //calc score
  function calcScore() {
    setScore(answers.filter(answer => answer.isCorrect).length);
    setFinish(true);
  }

  //play again
  function playAgain() {
    setStart(false);
    setQuestions(undefined);
    setAnswers([]);
    setSelected(false);
    setScore(0);
    setFinish(false);
  }

  return (
    <main className="app-container">
      {/* Starting App page */}
      {!start && (
        <section className="app--starting__page">
          <h1 className="title">Quizzical</h1>
          <p className="slogan">Test Your Knowledge!!</p>
          <button className="start-quiz-btn" onClick={startQuiz}>
            Start quiz
          </button>
        </section>
      )}

      {/* Quizz App Page  */}
      {start && (
        <section className="questions">
          {questionElements || <h4 className="loading">Loading ...</h4>}
          {selected && (
            <div className="footer">
              {finish && (
                <strong className="score">
                  You scored {score}/5 correct answers
                </strong>
              )}
              {selected && !finish && (
                <button
                  className={answers.length === 5 ? 'button' : 'not-clickable'}
                  onClick={calcScore}
                >
                  Check answers
                </button>
              )}
              {finish && (
                <button className="button" onClick={playAgain}>
                  Play again
                </button>
              )}
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default App;
