import CATEGORY_EMOJI from '@/lib/categoryEmoji.js';

const CATEGORIES = [
  { id: 'phones',       label: 'Phones'     },
  { id: 'laptops',      label: 'Laptops'    },
  { id: 'headphones',   label: 'Headphones' },
  { id: 'tvs',          label: 'TVs'        },
  { id: 'gpus',         label: 'GPUs'       },
  { id: 'soundsystems', label: 'Sound'      },
];

export { CATEGORIES };

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="category-filter">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={`category-pill ${value === cat.id ? 'category-pill--active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          <span className="category-pill__emoji">{CATEGORY_EMOJI[cat.id]}</span>
          <span className="category-pill__label">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
