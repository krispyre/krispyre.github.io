interface Props {
  values: number[];
  length: number;
  onClick: (i: number) => void;
}

function Digits({ values, length, onClick }: Props) {
  return (
    <>
      {values.map((value, index) => (
        <button
          className={"bit"}
          key={index}
          onClick={() => onClick(index)}
        >
          {value}
        </button>
      ))}
    </>
  );
}

export default Digits;
