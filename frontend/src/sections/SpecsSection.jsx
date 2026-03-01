import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.jsx';
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

const SPEC_TIPS = {
  chip:              'The processor drives everything — speed, efficiency, and battery life all hinge on this.',
  ram:               'More RAM lets you run more apps at once without slowdowns or reloads.',
  storage:           'Total space for your apps, photos, and files. More is always better.',
  camera:            'Megapixels, aperture, and features like optical zoom determine photo and video quality.',
  battery:           'Larger capacity means more hours before you need to plug in.',
  display:           'Size, resolution, and refresh rate affect how sharp and smooth everything looks.',
  os:                'The operating system shapes your app ecosystem, update cadence, and overall experience.',
  gpu:               'The graphics card handles visuals — critical for gaming, video editing, and 3D work.',
  type:              'Form factor affects comfort, sound isolation, and portability.',
  driver:            'Larger drivers move more air and generally produce richer, fuller sound.',
  noiseCancelling:   'ANC uses microphones to cancel ambient noise — great for commutes and open offices.',
  connectivity:      'Determines how you connect — wired gives zero latency, Bluetooth adds freedom.',
  frequencyResponse: 'The frequency range reproduced. Wider coverage means more detailed highs and lows.',
  weight:            'Lighter headphones are more comfortable over long listening sessions.',
  screenSize:        'Bigger screens are more immersive but need more room and viewing distance.',
  resolution:        'Higher resolution means sharper images — especially noticeable up close.',
  panel:             'OLED gives perfect blacks; QLED offers brighter highlights. Panel type defines picture quality.',
  refreshRate:       '120 Hz+ makes motion in sports and gaming dramatically smoother.',
  hdr:               'HDR support unlocks brighter highlights and deeper blacks for a more lifelike picture.',
  ports:             'More ports means easier connections for consoles, soundbars, and other devices.',
  vram:              'More VRAM lets you push higher resolutions and more detailed textures without stuttering.',
  architecture:      'Newer architecture delivers better performance per watt and access to the latest features.',
  tdp:               'Thermal Design Power defines heat output — higher TDP needs better cooling.',
  cudaOrStreams:      'More compute cores accelerate both gaming frame rates and GPU-heavy workloads.',
  memoryBandwidth:   'Faster bandwidth feeds the GPU data quicker — important at 4K and above.',
  interface:         'PCIe version and lane count set the theoretical bandwidth ceiling.',
  length:            'Longer cards may not fit compact cases — always check clearance before buying.',
  channels:          '2.1, 5.1, 7.1 — more channels create a wider, more enveloping surround soundstage.',
  power:             'Higher wattage means louder max volume and better dynamic range at all levels.',
  dolby:             'Dolby Atmos or DTS adds height channels for true 3D spatial audio.',
  subwoofer:         'A dedicated sub reproduces deep bass that satellite speakers physically cannot.',
  dimensions:        'Physical size determines where the system can realistically be placed.',
};

function formatValue(value) {
  if (value === true)  return <span className="specs-bool specs-bool--yes">✓</span>;
  if (value === false) return <span className="specs-bool specs-bool--no">✗</span>;
  if (value == null || value === '') return <span className="specs-na">—</span>;
  return value;
}

function SpecLabel({ specKey }) {
  const tip   = SPEC_TIPS[specKey];
  const label = SPEC_LABELS[specKey] ?? specKey;

  if (!tip) return <span>{label}</span>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="specs-label-trigger">
          {label}
          <span className="specs-label-hint">?</span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={8} avoidCollisions={false} className="specs-tooltip-content">
        {tip}
      </TooltipContent>
    </Tooltip>
  );
}

export default function SpecsSection({ products }) {
  if (!products.length) return null;

  const category = products[0].category;
  const rows     = SPEC_ROWS[category] ?? Object.keys(products[0].specs ?? {});

  return (
    <TooltipProvider delayDuration={200}>
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
                    <SpecLabel specKey={key} />
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
    </TooltipProvider>
  );
}
