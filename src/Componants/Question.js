import React from 'react';
import { decode } from 'html-entities';
import { nanoid } from 'nanoid';
import Answers from './Answers';

const Question = ({ question, selectAnswers, questionId, finish }) => {
  const answerElements = question.options?.map(option => (
    <Answers
      question={question}
      questionId={questionId}
      answerId={option.id}
      key={option.id}
      option={option}
      selectAnswers={selectAnswers}
      finish={finish}
    />
  ));

  return (
    <section className="question-wrapper">
      <h4 className="qestion">{decode(question.question)}</h4>
      <ul className="answers">{answerElements}</ul>
    </section>
  );
};

export default Question;
