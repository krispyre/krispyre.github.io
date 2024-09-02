interface Props {
  value: number;
  onClick: () => void;
}

function Digits({ value, onClick }: Props) {
  return (
    <>
      <button
        className={value === 0 ? "bit zero" : "bit one"}
        onClick={onClick}
      ></button>
    </>
  );
}

export default Digits;
