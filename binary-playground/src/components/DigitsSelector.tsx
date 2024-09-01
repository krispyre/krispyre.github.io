function DigitsSelector() {
  return (
    <div>
      <span>Number of digits: </span>
      <input
        type="number"
        min="2"
        max="16"
      />
      digit selector goes here
    </div>
  );
}

export default DigitsSelector;
