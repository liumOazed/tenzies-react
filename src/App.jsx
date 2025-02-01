import { useState, useRef, useEffect } from 'react'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Die from './components/Die'

export default function App() {

  const [dice, setDice] = useState(() => generateAllNewDice())
  const [rolls, setRolls] = useState(0); // Roll counter
  const [time, setTime] = useState(0); // Timer
  const [isRunning, setIsRunning] = useState(false); // Timer state
  const buttonRef = useRef(null)
  const conf = <Confetti />


  const gameWon = dice.every(die => die.isHeld)
    && dice.every(die => die.value === dice[0].value)

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);
  // Start timer on first roll
  useEffect(() => {
    if (rolls > 0 && !isRunning) {
      setIsRunning(true);
    }
  }, [rolls]);

  // Stop timer and show win message when game is won
  useEffect(() => {
    if (gameWon) {
      setIsRunning(false);
      buttonRef.current.focus();
    }
  }, [gameWon]);

  // useEffect(() => {
  //   if (gameWon) {
  //     buttonRef.current.focus()
  //   }
  // }, [gameWon])



  function generateAllNewDice() {

    // const newDice = []
    // for (let i = 0; i < 10; i++) {
    //   const rand = Math.ceil(Math.random() * 10)
    //   newDice.push(rand)
    return new Array(10).fill(0)
      .map(() => ({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
      }))
  }
  function rollDice() {
    if (!gameWon) {
      setDice(prevDice => prevDice.map(die =>
        die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }))
      setRolls(prevRolls => prevRolls + 1) // Increment roll counter
    } else {
      setDice(generateAllNewDice())
      setRolls(0); // Reset roll counter
      setTime(0); // Reset timer
      setIsRunning(false); // Stop timer
    }
  }

  function hold(id) {
    setDice(prevDice => prevDice.map(die =>
      die.id === id ? { ...die, isHeld: !die.isHeld } : die))
  }

  // when we map over an array, react needs a dedicated jsx element key
  const diceElements = dice.map(dieObj => <Die
    key={dieObj.id}
    value={dieObj.value}
    isHeld={dieObj.isHeld}
    hold={hold}
    id={dieObj.id}
  />)

  return (

    <main>
      {gameWon && conf}
      <div aria-live='polite' className='sr-only'>
        {gameWon && <p>You won! Press "New Game" to play again.</p>}
      </div>
      <h1 className="title">Let's Play Tenzies!</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="stats">
        <p>Time: {time} seconds</p>
        <p>Rolls: {rolls}</p>
      </div>
      <div className='dice-container'>
        {diceElements}
      </div>
      <button ref={buttonRef} className='roll-dice' onClick={rollDice}>{gameWon ? "New Game" : "Roll Dice"}</button>
    </main>

  )
}
