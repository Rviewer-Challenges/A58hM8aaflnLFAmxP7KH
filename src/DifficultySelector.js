import React from 'react';

const DifficultySelector = ({ onSelectDifficulty }) => {
  return (
    <div className="difficulty-selector">
      <button onClick={() => onSelectDifficulty('easy')}>Easy (4x4)</button>
      <button onClick={() => onSelectDifficulty('medium')}>Medium (4x6)</button>
      <button onClick={() => onSelectDifficulty('hard')}>Hard (5x6)</button>
    </div>
  );
};

export default DifficultySelector;
