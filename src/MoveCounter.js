import React from 'react';

const MoveCounter = ({ turns }) => {
  return (
    <div className="move-counter">
      Moves: {turns}
    </div>
  );
};

export default MoveCounter;
