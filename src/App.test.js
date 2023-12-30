import { render, screen , fireEvent } from '@testing-library/react';
import App from './App';
import Modal from 'react-modal';

// This line is necessary to set up the modal root element for testing
Modal.setAppElement(document.createElement('div'));

describe('Memory Game tests', () => {
  test('renders the game title header', () => {
    render(<App />);
    const titleElement = screen.getByText(/Memory Game/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the game description', () => {
    render(<App />);
    const descriptionElement = screen.getByText(/Test your memory by matching the cards before time runs out!/i);
    expect(descriptionElement).toBeInTheDocument();
  });


  test('does not render the game board before the game starts', () => {
    render(<App />);
    const gameBoardElement = screen.queryByTestId('game-board'); // You will need to add 'data-testid="game-board"' to your GameBoard component
    expect(gameBoardElement).not.toBeInTheDocument();
  });

  describe('Difficulty Levels Test', () => {
    test('checks if there are three difficulty levels', () => {
      render(<App />);
      const easyButton = screen.getByRole('button', { name: /easy/i });
      const mediumButton = screen.getByRole('button', { name: /medium/i });
      const hardButton = screen.getByRole('button', { name: /hard/i });
  
      expect(easyButton).toBeInTheDocument();
      expect(mediumButton).toBeInTheDocument();
      expect(hardButton).toBeInTheDocument();
    });
  });

  
  describe('Card count based on difficulty level', () => {
    test('counts the number of cards for the easy level', async () => {
      render(<App />);
      fireEvent.click(screen.getByText(/Easy \(4x4\)/i));
      // Here, you might need to wait for the cards to be rendered
      const cards = await screen.findAllByTestId('card');
      expect(cards).toHaveLength(16); // 4x4 grid equals 16 cards
    });

    test('counts the number of cards for the medium level', async () => {
      render(<App />);
      fireEvent.click(screen.getByText(/Medium \(4x6\)/i));
      // Here, you might need to wait for the cards to be rendered
      const cards = await screen.findAllByTestId('card');
      expect(cards).toHaveLength(24); // 4x6 grid equals 24 cards
    });

    test('counts the number of cards for the hard level', async () => {
      render(<App />);
      fireEvent.click(screen.getByText(/Hard \(5x6\)/i));
      // Here, you might need to wait for the cards to be rendered
      const cards = await screen.findAllByTestId('card');
      expect(cards).toHaveLength(30); // 5x6 grid equals 30 cards
    });
  
 
  });
  
});
