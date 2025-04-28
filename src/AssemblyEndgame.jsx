import { languages } from './language';
import clsx from 'clsx';
import { useState } from 'react';

export default function AssemblyEndgame() {
  const words = ["react", "javascript", "typescript", "python", "html"];
  const [currentWord, setCurrentWord] = useState(words[0]);  // Start with the first word
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(3); // User starts with 3 attempts
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  // Generate keyboard elements dynamically with conditional styling for correct/incorrect
  const keyboardElements = alphabet.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);

    const className = clsx({
      'bg-[#10A95B]': isCorrect,  // Correct guess (green)
      'bg-[#EC5D49]': isWrong,    // Wrong guess (red)
      'hover:bg-amber-500': !isGuessed,  // Default hover color
      'h-[35px] w-[35px] px-3 py-1 cursor-pointer rounded-sm font-bold bg-amber-400 text-zinc-800 border border-[#D7D7D7]': true,
    });

    return (
      <button
        key={letter}
        className={className}
        onClick={() => addGuessedLetter(letter)}
        disabled={isGuessed} // Disable button if letter has already been guessed
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  // Add guessed letter to the guessed letters list
  function addGuessedLetter(letter) {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters((prevLetters) => [...prevLetters, letter]);

      // If the letter is incorrect, decrease attempts
      if (!currentWord.includes(letter)) {
        setAttemptsLeft((prev) => prev - 1);
      }
    }
  }

  // Display the word with blanks for unguessed letters
  const letterElements = currentWord.split("").map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter);
    return (
      <span
        key={index}
        className="h-10 w-10 bg-[#323232] flex justify-center items-center text-[1.125rem] border-b border-[#F9F4DA]"
      >
        {isGuessed ? letter.toUpperCase() : "_"}
      </span>
    );
  });

  // Check if the user has won the game (all letters guessed)
  const isWordGuessed = currentWord.split("").every((letter) => guessedLetters.includes(letter));

  // Handle game logic for winning or restarting the game
  if (isWordGuessed) {
    setTimeout(() => {
      // Change to a new word if the current one is guessed
      const nextWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(nextWord);
      setGuessedLetters([]);
      setAttemptsLeft(3); // Reset attempts for the new word
    }, 1000); // Wait for 1 second before switching words
  }

  // Handle when the user runs out of attempts
  if (attemptsLeft <= 0) {
    setTimeout(() => {
      // Reset the game if attempts are finished
      setCurrentWord(words[0]);
      setGuessedLetters([]);
      setAttemptsLeft(3); // Reset attempts when restarting
    }, 1000); // Wait for 1 second before restarting
  }

  return (
    <main className="box-border min-h-screen min-w-[720px] m-0 font-['Hanken_Grotesk', Arial, sans-serif] p-5 h-screen flex justify-center items-center flex-col bg-black">
      <header className="text-center mb-4 w-[350px]">
        <h1 className="text-[1.5rem] font-medium text-[#F9F4DA]">Assembly :Endgame</h1>
        <p className="text-sm max-w-[350px] text-[#8E8E8E]">
          Guess the word within {attemptsLeft} attempts to keep the programming world safe from Assembly!
        </p>
      </header>

      <section className={clsx("w-[350px] game-status text-[#F9F4DA] rounded-md my-[20px] flex flex-col justify-center items-center", {
        'bg-[#10A95B]': isWordGuessed,  // Green background when won
        'bg-[#EC5D49]': attemptsLeft <= 0,  // Red background when game over
      })}>
        {isWordGuessed ? (
          <>
            <h2 className="text-[1.25rem] m-[5px]">You win!</h2>
            <p className="m-[5px]">Well done! 🎉</p>
          </>
        ) : attemptsLeft <= 0 ? (
          <>
            <h2 className="text-[1.25rem] m-[5px]">Game Over!</h2>
            <p className="m-[5px]">Better luck next time! 😔</p>
          </>
        ) : null}
      </section>

      <section className="flex flex-wrap gap-3 language-chips mb-4">
        {languages.map((lang, index) => (
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: lang.backgroundColor,
              color: lang.color,
            }}
          >
            {lang.name}
          </span>
        ))}
      </section>

      <section className="word flex justify-center gap-0.5 mb-4 text-white">
        {letterElements}
      </section>

      <section className="keyboard flex flex-wrap max-w-[450px] justify-center gap-6 mb-4">
        {keyboardElements}
      </section>

      <button
        type="button"
        className="new-game bg-[#11B5E5] border border-[#D7D7D7] rounded w-[225px] h-[40px] px-3 py-1.5 mx-auto block cursor-pointer"
        onClick={() => {
          // Reset game when New Game button is clicked
          setCurrentWord(words[0]);
          setGuessedLetters([]);
          setAttemptsLeft(3);
        }}
      >
        New Game
      </button>
    </main>
  );
}
