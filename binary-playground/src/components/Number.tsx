interface Props {
  digits: number[];
  length: number;
  onClick: (i: number) => void;
}

function Number({ digits, length, onClick }: Props) {
  return (
    <>
      {digits.map((digit, index) => (
        <button
          className={digit === 0 ? "bit zero" : "bit one"}
          key={length - index}
          onClick={() => onClick(index)}
        >
          {digit}
        </button>
      ))}
    </>
  );
}

export default Number;
