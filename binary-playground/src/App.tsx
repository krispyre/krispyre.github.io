import { useState } from "react";
import Digits from "./components/Digits";
import DigitsSelector from "./components/DigitsSelector";
import "./App.css";

function calcDec(d: Array<number>, isSigned: boolean) {
  let dec = 2 ** d.length * d[0];
  if (isSigned && d[0] == 1) {
    dec *= -1;
  }
  for (let i = 1, n = d.length - 1; i < n; i++) {
    dec += 2 ** (n - i) * d[i];
  }
  return dec;
}

function App() {
  const [digits, setDigits] = useState([1, 1, 0, 0, 1, 1]);
  //const [decimal, setDecimal] = useState(calcDec(digits, false));

  let handleDigits = (i: number) => {
    // Don't change digits alone, make a copy and replace: https://react.dev/learn/updating-objects-in-state
    let newDigits = digits.slice();
    newDigits[i] = 1 - newDigits[i];
    setDigits(newDigits);

    //console.log("clicked bit ", i);
    console.log(digits);
    console;
  };

  return (
    <>
      <DigitsSelector />
      <Digits
        values={digits}
        onClick={handleDigits}
        length={digits.length}
      />
    </>
  );
}

export default App;
