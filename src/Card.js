import React from 'react';

function Card({ card, handleCardClick, flipped }) {
  // Card click event handler
  const handleClick = () => {
    // Call the passed handleCardClick only if the card is not already matched
    if (!card.matched && !card.isFlipped) {
        handleCardClick(card);
      }
  };

  // Determine the image to show based on the flipped state
  const imageUrl = card.isFlipped ? card.src : process.env.PUBLIC_URL + '/img/choose.jpg';

  // Conditional styling for the card, if it's matched or not
  const cardStyle = card.matched ? { borderColor: 'green' } : {};

  return (
    <div className={`card ${card.isFlipped || card.matched ? 'flipped' : ''}`} onClick={handleClick}>
      <img src={card.isFlipped || card.matched ? card.src : process.env.PUBLIC_URL + '/img/choose.jpg'} alt="card" />
    </div>
  );
}

export default Card;
