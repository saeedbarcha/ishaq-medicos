export function QtyStepper({
  value,
  min = 1,
  max = 99,
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="qty-stepper">
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(Math.max(min, value - 1))}>
        −
      </button>
      <span>{value}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(Math.min(max, value + 1))}>
        +
      </button>
    </div>
  );
}
