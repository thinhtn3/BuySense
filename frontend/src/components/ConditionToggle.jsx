const OPTIONS = [
  { value: 'new',  label: 'New' },
  { value: 'used', label: 'Used' },
];

export default function ConditionToggle({ value, onChange }) {
  return (
    <div className="condition-toggle" role="group" aria-label="Condition">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`condition-option${value === opt.value ? ' condition-option--active' : ''}`}
          onClick={() => onChange(opt.value)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
