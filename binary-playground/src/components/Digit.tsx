interface Props {
  value: number;
  onClick: () => void;
}

function Digits({ value, onClick }: Props) {
  return (
    <>
      <button
        className="bit"
        onClick={onClick}
      >
        {value}
      </button>
    </>
  );
}

export default Digits;
