import React from 'react';
import { decode } from 'html-entities';

const Answers = ({
  question,
  option,
  answerId,
  questionId,
  selectAnswers,
  finish,
}) => {
  let styles = {
    background: option.isSelected ? '#d6dbf5' : '',
    borderColor: option.isSelected ? '#d6dbf5' : '',
  };

  //change styles for answers (correct & incorrect)
  function changeStyles() {
    if (finish) {
      //change selected answer styles
      if (option.isSelected) {
        styles = {
          background: option.isCorrect ? '#94d7a2' : '#F8BCBC',
          opacity: question.correct_answer === option.answer ? 1 : 0.6,
          border: 0,
          userSelect: 'none',
          pointerEvents: 'none',
        };
      } else if (
        !option.isSelected &&
        question.correct_answer === option.answer
      ) {
        //show non selected correct answers and diable them
        styles = {
          background:
            question.correct_answer === option.answer ? '#94d7a2' : '',
          opacity: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          border: 0,
        };
      } else {
        //disable the rest
        styles = {
          opacity: 0.6,
          userSelect: 'none',
          pointerEvents: 'none',
        };
      }
    }
  }
  changeStyles();
  return (
    <>
      <li
        style={styles}
        className="answers-list"
        onClick={e => selectAnswers(questionId, answerId)}
      >
        {decode(option.answer)}
      </li>
    </>
  );
};

export default Answers;
