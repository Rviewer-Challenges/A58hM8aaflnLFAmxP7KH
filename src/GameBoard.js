import React from 'react';
import Card from './Card';

const GameBoard = ({ cards, onCardClick, difficulty }) => {
  // Use a function or a simple object lookup to get the class based on the difficulty
  const getBoardClass = (difficulty) => {
    const boardClasses = {
      easy: 'game-board-easy',
      medium: 'game-board-medium',
      hard: 'game-board-hard'
    };
    return boardClasses[difficulty] || 'game-board-easy'; // Default to 'game-board-easy' if not found
  };
  console.log(cards)
  return (
    <div className={`game-board ${getBoardClass(difficulty)}`}>
      {cards.map(card => (
  <Card 
  key={card.id} 
  card={card} 
  handleCardClick={onCardClick}
/>
      ))}
    </div>
  );
};

export default GameBoard;
