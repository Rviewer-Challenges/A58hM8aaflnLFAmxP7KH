import React, { useState, useEffect } from 'react';
import Card from './Card';
import Timer from './Timer'; // This is a new component you will need to create
import MoveCounter from './MoveCounter'; // This is a new component you will need to create
import DifficultySelector from './DifficultySelector'; // This is a new component you will need to create
import GameBoard from './GameBoard'; // This is a new component you will need to create
import cardImages from './cardImages'; // Assume you export the images from a separate file

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [difficulty, setDifficulty] = useState('easy'); // New state for difficulty
  const [timeLeft, setTimeLeft] = useState(60); // New state for the timer
  const [isGameStarted, setIsGameStarted] = useState(false); // New state to track if the game has started
  const [openCards, setOpenCards] = useState([]);  // Add this line to your existing state declarations

const initializeGame = (selectedDifficulty) => {
  // Calculate the number of unique images needed based on difficulty level
  const numberOfPairs = selectedDifficulty === 'easy' ? 8 : selectedDifficulty === 'medium' ? 12 : 15;

  // Select the unique images
  const selectedImages = cardImages.slice(0, numberOfPairs);

  // Duplicate and shuffle the selected images to create pairs
  let shuffledCards = [...selectedImages, ...selectedImages]
    .sort(() => Math.random() - 0.5) // Shuffle the cards
    .map((card) => ({
      ...card,
      id: Math.random(), // Assign random ID for key prop
      isFlipped: false, // All cards start unflipped
      matched: false // All cards start unmatched
    }));

  // Set the shuffled cards to state
  setCards(shuffledCards);
  setTurns(0);
  setTimeLeft(60);
  setIsGameStarted(true);
};


// In the useEffect for the timer...
  useEffect(() => {
    // Existing timer logic...

    // Check for game end when time runs out
    if (timeLeft === 0) {
      // Determine if all cards have been matched
      const allMatched = cards.every(card => card.matched);
      if (allMatched) {
        // Handle win
        console.log("You've won!");
      } else {
        // Handle loss
        console.log("Time's up! Try again.");
      }
    }
  }, [timeLeft, cards]);

  const handleCardClick = (selectedCard) => {
    // If two cards are already open, do not allow more to be flipped until they are reset
    if (openCards.length === 2) {
      return;
    }
  
    // Set the isFlipped property to true for the clicked card
    setCards(prevCards => prevCards.map(card => 
      card.id === selectedCard.id ? {...card, isFlipped: true} : card
    ));
  
    // Add the clicked card to the array of open cards
    setOpenCards(prevOpenCards => [...prevOpenCards, selectedCard]);
  
    // If this is the second card being opened
    if (openCards.length === 1) {
      // Increment the move counter
      setTurns(prevTurns => prevTurns + 1);
  
      // Use a timeout to allow the state update from setOpenCards to complete
      setTimeout(() => {
        // Check for a match using the state after it has updated
        setCards(prevCards => {
          const [firstCard, secondCard] = openCards.concat(selectedCard);
          if (firstCard.src === secondCard.src) {
            // It's a match! Set both cards as matched
            return prevCards.map(card => 
              card.src === firstCard.src ? {...card, matched: true} : card
            );
          } else {
            // No match, flip both cards back over
            return prevCards.map(card => 
              card.id === firstCard.id || card.id === secondCard.id ? {...card, isFlipped: false} : card
            );
          }
        });
  
        // Reset openCards
        setOpenCards([]);
  
      }, selectedCard === openCards[0] ? 0 : 1000); // No delay if clicking the same card, otherwise delay
    }
  };
  
  

  // Handle difficulty selection
  const handleDifficultyChange = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    initializeGame(selectedDifficulty);
  };

  // UI rendering
  return (
    <div className="app">
      {!isGameStarted ? (
        <DifficultySelector onSelectDifficulty={handleDifficultyChange} />
      ) : (
        <>
          <Timer timeLeft={timeLeft} />
          <MoveCounter turns={turns} />
          <GameBoard 
            cards={cards}
            onCardClick={handleCardClick}
            difficulty={difficulty}
          />
          <button onClick={() => setIsGameStarted(false)}>Back to selection</button>
        </>
      )}
    </div>
  );
}

export default App;
