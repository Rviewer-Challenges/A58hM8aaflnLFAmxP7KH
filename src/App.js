import React, { useState, useEffect } from 'react';
import Card from './Card';
import Timer from './Timer'; 
import MoveCounter from './MoveCounter'; 
import DifficultySelector from './DifficultySelector'; 
import GameBoard from './GameBoard'; 
import cardImages from './cardImages'; 
import Modal from 'react-modal'; 

Modal.setAppElement = () => {};


function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [difficulty, setDifficulty] = useState('easy'); 
  const [timeLeft, setTimeLeft] = useState(60); 
  const [isGameStarted, setIsGameStarted] = useState(false); 
  const [openCards, setOpenCards] = useState([]);  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [startTime, setStartTime] = useState(0); 
  const [timeTaken, setTimeTaken] = useState(0);


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
  setStartTime(Date.now());
};


  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft === 0 && isGameStarted) { 
        clearInterval(timer);
        setShowFailModal(true);
      } else {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft, isGameStarted]); 

  useEffect(() => {
    const allMatched = cards.every((card) => card.matched);
    if (allMatched && isGameStarted) { 
      const endTime = Date.now();
      const timeTakenInSeconds = Math.floor((endTime - startTime) / 1000); 
      setTimeTaken(timeTakenInSeconds); 
      setShowSuccessModal(true);
    }
  }, [cards, startTime, isGameStarted]); 

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

  return (
    <div className="app">
      {!isGameStarted ? (
        <>
          <header style={{ textAlign: 'center' }}>
            <h1>Memory Game</h1>
            <p>Test your memory by matching the cards before time runs out!</p>
          </header>
          <DifficultySelector onSelectDifficulty={handleDifficultyChange} />
        </>
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

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
        contentLabel="Success Modal"
      >
        <h2>Congratulations!</h2>
        <p>You've found all the images in {timeTaken} seconds.</p>
        <button onClick={() => setShowSuccessModal(false)}>Close</button>
      </Modal>

      {/* Fail Modal */}
      <Modal
        isOpen={showFailModal}
        onRequestClose={() => setShowFailModal(false)}
        contentLabel="Fail Modal"
      >
        <h2>Time's Up!</h2>
        <p>Sorry, time has passed. Try again.</p>
        <button onClick={() => setShowFailModal(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default App;
