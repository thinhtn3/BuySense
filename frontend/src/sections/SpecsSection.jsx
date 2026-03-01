import CATEGORY_EMOJI from '@/lib/categoryEmoji.js';

// Canonical spec row order + display labels per category
const SPEC_ROWS = {
  phones:       ['chip','ram','storage','camera','battery','display','os'],
  laptops:      ['chip','ram','storage','display','battery','gpu','os'],
  headphones:   ['type','driver','noiseCancelling','battery','connectivity','frequencyResponse','weight'],
  tvs:          ['screenSize','resolution','panel','refreshRate','hdr','os','ports'],
  gpus:         ['vram','architecture','tdp','cudaOrStreams','memoryBandwidth','interface','length'],
  soundsystems: ['type','channels','power','connectivity','dolby','subwoofer','dimensions'],
};

const SPEC_LABELS = {
  chip:              'Chip',
  ram:               'RAM',
  storage:           'Storage',
  camera:            'Camera',
  battery:           'Battery',
  display:           'Display',
  os:                'OS',
  gpu:               'GPU',
  type:              'Type',
  driver:            'Driver',
  noiseCancelling:   'Noise Cancelling',
  connectivity:      'Connectivity',
  frequencyResponse: 'Frequency Response',
  weight:            'Weight',
  screenSize:        'Screen Size',
  resolution:        'Resolution',
  panel:             'Panel',
  refreshRate:       'Refresh Rate',
  hdr:               'HDR',
  ports:             'Ports',
  vram:              'VRAM',
  architecture:      'Architecture',
  tdp:               'TDP',
  cudaOrStreams:      'CUDA / Streams',
  memoryBandwidth:   'Memory Bandwidth',
  interface:         'Interface',
  length:            'Card Length',
  channels:          'Channels',
  power:             'Power',
  dolby:             'Dolby',
  subwoofer:         'Subwoofer',
  dimensions:        'Dimensions',
};

function formatValue(value) {
  if (value === true)  return <span className="specs-bool specs-bool--yes">✓</span>;
  if (value === false) return <span className="specs-bool specs-bool--no">✗</span>;
  if (value == null || value === '') return <span className="specs-na">—</span>;
  return value;
}

export default function SpecsSection({ products }) {
  if (!products.length) return null;

  const category = products[0].category;
  const rows     = SPEC_ROWS[category] ?? Object.keys(products[0].specs ?? {});

  return (
    <section className="specs-section">
      <h2 className="specs-heading">Specs at a Glance</h2>

      <div className="specs-card">
        <table className="specs-table">
          <thead>
            <tr>
              <th className="specs-th specs-th--label">Spec</th>
              {products.map((p) => (
                <th key={p.id} className="specs-th">
                  <div className="specs-th-inner">
                    <span className="specs-th-emoji">
                      {CATEGORY_EMOJI[p.category] ?? '📦'}
                    </span>
                    {p.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((key) => (
              <tr key={key} className="specs-row">
                <td className="specs-td specs-td--label">
                  {SPEC_LABELS[key] ?? key}
                </td>
                {products.map((p) => (
                  <td key={p.id} className="specs-td">
                    {formatValue(p.specs?.[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
