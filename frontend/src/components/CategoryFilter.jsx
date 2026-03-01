import { Smartphone, Laptop, Headphones, Tv, Cpu, Speaker } from 'lucide-react';

const CATEGORIES = [
  { id: 'phones',       label: 'Phones',      Icon: Smartphone },
  { id: 'laptops',      label: 'Laptops',     Icon: Laptop     },
  { id: 'headphones',   label: 'Headphones',  Icon: Headphones },
  { id: 'tvs',          label: 'TVs',         Icon: Tv         },
  { id: 'gpus',         label: 'GPUs',        Icon: Cpu        },
  { id: 'soundsystems', label: 'Sound',       Icon: Speaker    },
];

export { CATEGORIES };

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="category-filter">
      {CATEGORIES.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`category-pill ${value === id ? 'category-pill--active' : ''}`}
          onClick={() => onChange(id)}
        >
          <Icon size={17} strokeWidth={1.75} className="category-pill__icon" />
          <span className="category-pill__label">{label}</span>
        </button>
      ))}
    </div>
  );
}
